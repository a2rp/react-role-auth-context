import React, { useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../hooks/useLocalCollection";

/* helpers */
const z = (n) => String(n).padStart(2, "0");
const toHM = (mins) => `${z(Math.floor(mins / 60))}:${z(mins % 60)}`;
const parseHM = (hm) => {
    if (!hm || !/^\d{2}:\d{2}$/.test(hm)) return null;
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
};
const diffMins = (startHM, endHM) => {
    const s = parseHM(startHM) ?? 0;
    const e = parseHM(endHM) ?? 0;
    let d = e - s;
    if (d < 0) d += 24 * 60; // overnight
    return d;
};
const humanDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
};

function downloadFile(name, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
}

/* lightweight confirm */
function ConfirmOverlay({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div role="dialog" aria-modal="true" aria-label={title}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", display: "grid", placeItems: "center", zIndex: 9999 }}
            onClick={onCancel}>
            <div onClick={(e) => e.stopPropagation()}
                style={{ width: "min(560px,92vw)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 16 }}>
                <h4 style={{ margin: "0 0 8px" }}>{title}</h4>
                <p style={{ margin: 0, color: "var(--muted)" }}>{message}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm} style={{ background: "var(--danger)", borderColor: "var(--danger)", color: "#fff" }}>Confirm</button>
                </div>
            </div>
        </div>
    );
}

const SEARCH_FIELDS = ["name", "code", "startTime", "endTime", "id"];

export default function Shifts() {
    const fileRef = useRef(null);
    const shifts = useLocalCollection("shifts", {
        searchFields: SEARCH_FIELDS,
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [confirm, setConfirm] = useState({ open: false, id: null, mode: "delete" });
    const [showCreate, setShowCreate] = useState(false);
    const [draft, setDraft] = useState({
        name: "",
        code: "",
        startTime: "09:00",
        endTime: "18:00",
        color: "#2f74ff",
        isActive: true,
        notes: "",
    });

    const durationMins = useMemo(() => diffMins(draft.startTime, draft.endTime), [draft.startTime, draft.endTime]);

    const counts = useMemo(() => {
        const total = shifts.items.length;
        const active = shifts.items.filter((x) => !x.isDeleted && x.isActive).length;
        const deleted = shifts.items.filter((x) => x.isDeleted).length;
        return { total, active, deleted };
    }, [shifts.items]);

    const onCreate = (e) => {
        e.preventDefault();
        if (!draft.name.trim()) return;
        const dur = diffMins(draft.startTime, draft.endTime);
        const id = shifts.create({
            name: draft.name.trim(),
            code: draft.code.trim(),
            startTime: draft.startTime,
            endTime: draft.endTime,
            durationMins: dur,
            color: draft.color,
            isActive: !!draft.isActive,
            notes: draft.notes.trim(),
            isDeleted: false,
        });
        shifts.markRecent(id);
        setShowCreate(false);
        setDraft({ name: "", code: "", startTime: "09:00", endTime: "18:00", color: "#2f74ff", isActive: true, notes: "" });
    };

    const requestDelete = (id) => setConfirm({ open: true, id, mode: "delete" });
    const requestRestore = (id) => setConfirm({ open: true, id, mode: "restore" });
    const performConfirm = () => {
        const { id, mode } = confirm;
        if (!id) return setConfirm({ open: false, id: null, mode: "delete" });
        mode === "delete" ? shifts.remove(id) : shifts.restore(id);
        setConfirm({ open: false, id: null, mode: "delete" });
    };

    const importJSON = async (file) => {
        if (!file) return;
        try {
            const text = await file.text();
            const arr = JSON.parse(text);
            // Back-compat: compute duration if missing
            const fixed = Array.isArray(arr)
                ? arr.map((s) => ({ ...s, durationMins: s?.durationMins ?? diffMins(s?.startTime, s?.endTime) }))
                : [];
            shifts.importData(fixed, { mode: "replace" });
        } catch (e) {
            console.error("Import failed:", e);
        }
    };

    const onHeaderSort = (key) => {
        shifts.setSort((prev) => {
            const dir = prev.by === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
            return { by: key, dir };
        });
    };

    const SortChev = ({ col }) => {
        const active = shifts.sort.by === col;
        const dir = shifts.sort.dir;
        return (
            <span aria-hidden
                style={{ display: "inline-block", marginLeft: 6, opacity: active ? 1 : 0.3, transform: active && dir === "desc" ? "rotate(180deg)" : "none", transition: "transform .2s var(--easing), opacity .2s var(--easing)" }}>
                ▲
            </span>
        );
    };

    return (
        <Styled.Page>
            <div className="header">
                <div className="title">
                    <h3>Shifts</h3>
                    <p className="muted">Define reusable shift templates. Overnight shifts supported.</p>
                </div>
                <div className="stats">
                    <div className="chip">Total: <strong>{counts.total}</strong></div>
                    <div className="chip">Active: <strong>{counts.active}</strong></div>
                    <div className="chip">Deleted: <strong>{counts.deleted}</strong></div>
                </div>
            </div>

            <Styled.Toolbar>
                <div className="left">
                    <input
                        type="text"
                        placeholder="Search name/code/time"
                        value={shifts.search}
                        onChange={(e) => shifts.setSearch(e.target.value)}
                        aria-label="Search shifts"
                    />
                </div>
                <div className="right">
                    <label className="toggle">
                        <input type="checkbox" checked={shifts.showDeleted} onChange={(e) => shifts.setShowDeleted(e.target.checked)} />
                        <span>Show deleted</span>
                    </label>

                    <button onClick={() => downloadFile("shifts.json", shifts.exportData())}>Export JSON</button>

                    <input ref={fileRef} type="file" accept="application/json" onChange={(e) => importJSON(e.target.files?.[0])} style={{ display: "none" }} />
                    <button onClick={() => fileRef.current?.click()}>Import JSON</button>

                    <button onClick={() => setShowCreate((s) => !s)}>{showCreate ? "Close" : "New Shift"}</button>
                </div>
            </Styled.Toolbar>

            {showCreate && (
                <Styled.CreateCard as="form" onSubmit={onCreate}>
                    <div className="grid">
                        <div>
                            <label>Name</label>
                            <input value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} placeholder="Morning Shift" required />
                        </div>
                        <div>
                            <label>Code</label>
                            <input value={draft.code} onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))} placeholder="MORN" />
                        </div>
                        <div>
                            <label>Color</label>
                            <input type="color" value={draft.color} onChange={(e) => setDraft((d) => ({ ...d, color: e.target.value }))} />
                        </div>
                        <div>
                            <label>Start</label>
                            <input type="time" value={draft.startTime} onChange={(e) => setDraft((d) => ({ ...d, startTime: e.target.value }))} step={300} />
                        </div>
                        <div>
                            <label>End</label>
                            <input type="time" value={draft.endTime} onChange={(e) => setDraft((d) => ({ ...d, endTime: e.target.value }))} step={300} />
                        </div>
                        <div className="inline">
                            <div className="duration">
                                <span className="label">Duration</span>
                                <span className="value">{humanDuration(durationMins)} <span className="muted">({toHM(durationMins)})</span></span>
                            </div>
                        </div>
                        <div className="inline">
                            <label className="toggle">
                                <input type="checkbox" checked={draft.isActive} onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.checked }))} />
                                <span>Active</span>
                            </label>
                        </div>
                        <div className="span2">
                            <label>Notes</label>
                            <textarea rows={2} value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} placeholder="Optional" />
                        </div>
                    </div>
                    <div className="actions">
                        <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        <button type="submit" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>Save</button>
                    </div>
                </Styled.CreateCard>
            )}

            <Styled.TableWrap>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => onHeaderSort("name")} role="button">Name <SortChev col="name" /></th>
                            <th onClick={() => onHeaderSort("code")} role="button">Code <SortChev col="code" /></th>
                            <th>Color</th>
                            <th onClick={() => onHeaderSort("startTime")} role="button">Start <SortChev col="startTime" /></th>
                            <th onClick={() => onHeaderSort("endTime")} role="button">End <SortChev col="endTime" /></th>
                            <th onClick={() => onHeaderSort("durationMins")} role="button">Duration <SortChev col="durationMins" /></th>
                            <th onClick={() => onHeaderSort("updatedAt")} role="button">Updated <SortChev col="updatedAt" /></th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shifts.view.length === 0 && (
                            <tr>
                                <td colSpan={9}>
                                    <Styled.Empty><div className="hint">No shifts yet. Create your first one.</div></Styled.Empty>
                                </td>
                            </tr>
                        )}

                        {shifts.view.map((s) => (
                            <tr key={s.id} data-deleted={s.isDeleted ? "true" : "false"}>
                                <td>
                                    <span className="rowLink">{s.name || <em>Untitled</em>}</span>
                                    <div className="id">{s.id}</div>
                                </td>
                                <td>{s.code || "-"}</td>
                                <td>
                                    <span className="colorDot" style={{ background: s.color || "var(--accent)" }} />
                                </td>
                                <td>{s.startTime}</td>
                                <td>{s.endTime}</td>
                                <td>{humanDuration(s.durationMins ?? diffMins(s.startTime, s.endTime))}</td>
                                <td><span className="muted">{s.updatedAt}</span></td>
                                <td>
                                    {s.isDeleted ? <span className="pill danger">Deleted</span> : s.isActive ? <span className="pill ok">Active</span> : <span className="pill warn">Inactive</span>}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    {!s.isDeleted && (
                                        <>
                                            <button onClick={() => shifts.update(s.id, { isActive: !s.isActive })}>
                                                {s.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                            <button onClick={() => setConfirm({ open: true, id: s.id, mode: "delete" })}
                                                style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {s.isDeleted && (
                                        <button onClick={() => setConfirm({ open: true, id: s.id, mode: "restore" })}
                                            style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                                            Restore
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Styled.TableWrap>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete shift?" : "Restore shift?"}
                message={confirm.mode === "delete" ? "Soft delete only. You can restore it later." : "This shift will be restored."}
                onConfirm={performConfirm}
                onCancel={() => setConfirm({ open: false, id: null, mode: "delete" })}
            />
        </Styled.Page>
    );
}
