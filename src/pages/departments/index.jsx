import React, { useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../hooks/useLocalCollection";

/* tiny helper: download text as file */
function downloadFile(name, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}

/* lightweight confirm (custom, non-blocking) */
function ConfirmOverlay({ open, title = "Are you sure?", message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                display: "grid",
                placeItems: "center",
                zIndex: 9999,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(560px, 92vw)",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow)",
                    padding: 16,
                }}
            >
                <h4 style={{ margin: "0 0 8px 0" }}>{title}</h4>
                <p style={{ margin: 0, color: "var(--muted)" }}>{message}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                    <button onClick={onCancel}>Cancel</button>
                    <button
                        onClick={onConfirm}
                        style={{ background: "var(--danger)", borderColor: "var(--danger)", color: "#fff" }}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

const DEFAULT_SORT = { by: "updatedAt", dir: "desc" };
const SEARCH_FIELDS = ["name", "code", "lead", "id"];

export default function Departments() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [confirm, setConfirm] = useState({ open: false, id: null, mode: "delete" });

    const deps = useLocalCollection("departments", {
        searchFields: SEARCH_FIELDS,
        sortInitial: DEFAULT_SORT,
    });

    // inline create
    const [showCreate, setShowCreate] = useState(false);
    const [draft, setDraft] = useState({
        name: "",
        code: "",
        lead: "",
        notes: "",
    });

    const counts = useMemo(() => {
        const total = deps.items.length;
        const active = deps.items.filter((x) => !x.isDeleted).length;
        const deleted = total - active;
        return { total, active, deleted };
    }, [deps.items]);

    const onCreate = (e) => {
        e.preventDefault();
        const name = draft.name?.trim();
        if (!name) return;

        const id = deps.create({
            name,
            code: draft.code?.trim(),
            lead: draft.lead?.trim(),
            notes: draft.notes?.trim(),
            isDeleted: false,
        });

        setShowCreate(false);
        setDraft({ name: "", code: "", lead: "", notes: "" });
        navigate(`/departments/${id}`);
    };

    const requestDelete = (id) => setConfirm({ open: true, id, mode: "delete" });
    const requestRestore = (id) => setConfirm({ open: true, id, mode: "restore" });

    const performConfirm = () => {
        const { id, mode } = confirm;
        if (!id) return setConfirm({ open: false, id: null, mode: "delete" });
        if (mode === "delete") deps.remove(id);
        if (mode === "restore") deps.restore(id);
        setConfirm({ open: false, id: null, mode: "delete" });
    };

    const importJSON = async (file) => {
        if (!file) return;
        try {
            const text = await file.text();
            const arr = JSON.parse(text);
            const res = deps.importData(arr, { mode: "replace" });
            console.info(`Imported ${res.count} departments [${res.mode}]`);
        } catch (e) {
            console.error("Import failed:", e);
        }
    };

    const onHeaderSort = (key) => {
        deps.setSort((prev) => {
            const dir = prev.by === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
            return { by: key, dir };
        });
    };

    const SortChev = ({ col }) => {
        const active = deps.sort.by === col;
        const dir = deps.sort.dir;
        return (
            <span
                aria-hidden
                style={{
                    display: "inline-block",
                    marginLeft: 6,
                    opacity: active ? 1 : 0.3,
                    transform: active && dir === "desc" ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s var(--easing), opacity 0.2s var(--easing)",
                }}
            >
                ▲
            </span>
        );
    };

    return (
        <Styled.Page>
            <div className="header">
                <div className="title">
                    <h3>Departments</h3>
                    <p className="muted">Create, organize, and maintain departments. LocalStorage only.</p>
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
                        placeholder="Search name/code/lead"
                        value={deps.search}
                        onChange={(e) => deps.setSearch(e.target.value)}
                        aria-label="Search departments"
                    />
                </div>
                <div className="right">
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={deps.showDeleted}
                            onChange={(e) => deps.setShowDeleted(e.target.checked)}
                        />
                        <span>Show deleted</span>
                    </label>

                    <button onClick={() => downloadFile("departments.json", deps.exportData())}>
                        Export JSON
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="application/json"
                        onChange={(e) => importJSON(e.target.files?.[0])}
                        style={{ display: "none" }}
                    />
                    <button onClick={() => fileRef.current?.click()}>Import JSON</button>

                    <button onClick={() => setShowCreate((s) => !s)}>
                        {showCreate ? "Close" : "New Department"}
                    </button>
                </div>
            </Styled.Toolbar>

            {showCreate && (
                <Styled.CreateCard as="form" onSubmit={onCreate}>
                    <div className="grid">
                        <div>
                            <label>Name</label>
                            <input
                                value={draft.name}
                                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                                placeholder="e.g., Engineering"
                                required
                            />
                        </div>
                        <div>
                            <label>Code</label>
                            <input
                                value={draft.code}
                                onChange={(e) => setDraft((d) => ({ ...d, code: e.target.value }))}
                                placeholder="ENG / HR / FIN"
                            />
                        </div>
                        <div>
                            <label>Lead / Manager</label>
                            <input
                                value={draft.lead}
                                onChange={(e) => setDraft((d) => ({ ...d, lead: e.target.value }))}
                                placeholder="e.g., Priya Sharma"
                            />
                        </div>
                        <div className="span2">
                            <label>Notes</label>
                            <textarea
                                rows={2}
                                value={draft.notes}
                                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                                placeholder="Optional remarks"
                            />
                        </div>
                    </div>
                    <div className="actions">
                        <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
                        <button type="submit" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                            Save
                        </button>
                    </div>
                </Styled.CreateCard>
            )}

            <Styled.TableWrap>
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => onHeaderSort("name")} role="button">Name <SortChev col="name" /></th>
                            <th onClick={() => onHeaderSort("code")} role="button">Code <SortChev col="code" /></th>
                            <th onClick={() => onHeaderSort("lead")} role="button">Lead <SortChev col="lead" /></th>
                            <th onClick={() => onHeaderSort("updatedAt")} role="button">Updated <SortChev col="updatedAt" /></th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deps.view.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                    <Styled.Empty>
                                        <div className="hint">
                                            {deps.search
                                                ? "No departments match your search."
                                                : "No departments yet. Add the first one using 'New Department'."}
                                        </div>
                                    </Styled.Empty>
                                </td>
                            </tr>
                        )}

                        {deps.view.map((d) => (
                            <tr key={d.id} data-deleted={d.isDeleted ? "true" : "false"}>
                                <td>
                                    <NavLink
                                        to={`/departments/${d.id}`}
                                        title="Open detail"
                                        onClick={() => deps.markRecent(d.id)}
                                        className="rowLink"
                                    >
                                        {d.name || <em>Unnamed</em>}
                                    </NavLink>
                                    <div className="id">{d.id}</div>
                                </td>
                                <td>{d.code || "-"}</td>
                                <td>{d.lead || "-"}</td>
                                <td><span className="muted">{d.updatedAt}</span></td>
                                <td>
                                    {d.isDeleted ? (
                                        <span className="pill danger">Deleted</span>
                                    ) : (
                                        <span className="pill ok">Active</span>
                                    )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    {!d.isDeleted && (
                                        <>
                                            <button onClick={() => { deps.markRecent(d.id); navigate(`/departments/${d.id}/edit`); }}>
                                                Edit
                                            </button>
                                            <button onClick={() => requestDelete(d.id)} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {d.isDeleted && (
                                        <button onClick={() => requestRestore(d.id)} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
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
                title={confirm.mode === "delete" ? "Delete department?" : "Restore department?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later from 'Show deleted'."
                        : "The department will be restored and appear in the active list."
                }
                onConfirm={performConfirm}
                onCancel={() => setConfirm({ open: false, id: null, mode: "delete" })}
            />
        </Styled.Page>
    );
}
