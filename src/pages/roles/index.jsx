import React, { useMemo, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../hooks/useLocalCollection";

/* download helper */
function downloadFile(name, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}

/* lightweight confirm */
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
const FIELDS_FOR_SEARCH = ["name", "department", "level", "id"];

export default function Roles() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [confirm, setConfirm] = useState({ open: false, id: null, mode: "delete" });

    const roles = useLocalCollection("roles", {
        searchFields: FIELDS_FOR_SEARCH,
        sortInitial: DEFAULT_SORT,
    });

    // inline create panel
    const [showCreate, setShowCreate] = useState(false);
    const [draft, setDraft] = useState({
        name: "",
        department: "",
        level: "",
        isDefault: false,
        description: "",
    });

    const counts = useMemo(() => {
        const total = roles.items.length;
        const active = roles.items.filter((x) => !x.isDeleted).length;
        const deleted = total - active;
        return { total, active, deleted };
    }, [roles.items]);

    const onCreate = (e) => {
        e.preventDefault();
        const name = draft.name?.trim();
        if (!name) return;
        const id = roles.create({
            name,
            department: draft.department?.trim(),
            level: draft.level === "" ? null : Number(draft.level),
            isDefault: !!draft.isDefault,
            description: draft.description?.trim(),
            isDeleted: false,
        });
        // stay on list (clear panel)
        setShowCreate(false);
        setDraft({ name: "", department: "", level: "", isDefault: false, description: "" });
        // optional: navigate(`/roles/${id}`) if you build detail
        roles.markRecent(id);
    };

    const requestDelete = (id) => setConfirm({ open: true, id, mode: "delete" });
    const requestRestore = (id) => setConfirm({ open: true, id, mode: "restore" });

    const performConfirm = () => {
        const { id, mode } = confirm;
        if (!id) return setConfirm({ open: false, id: null, mode: "delete" });
        if (mode === "delete") roles.remove(id);
        if (mode === "restore") roles.restore(id);
        setConfirm({ open: false, id: null, mode: "delete" });
    };

    const importJSON = async (file) => {
        if (!file) return;
        try {
            const text = await file.text();
            const arr = JSON.parse(text);
            const res = roles.importData(arr, { mode: "replace" });
            console.info(`Imported ${res.count} roles [${res.mode}]`);
        } catch (e) {
            console.error("Import failed:", e);
        }
    };

    const onHeaderSort = (key) => {
        roles.setSort((prev) => {
            const dir = prev.by === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
            return { by: key, dir };
        });
    };

    const SortChev = ({ col }) => {
        const active = roles.sort.by === col;
        const dir = roles.sort.dir;
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
                    <h3>Roles</h3>
                    <p className="muted">Define job roles with department and level. LocalStorage only.</p>
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
                        placeholder="Search name/department/level"
                        value={roles.search}
                        onChange={(e) => roles.setSearch(e.target.value)}
                        aria-label="Search roles"
                    />
                </div>
                <div className="right">
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={roles.showDeleted}
                            onChange={(e) => roles.setShowDeleted(e.target.checked)}
                        />
                        <span>Show deleted</span>
                    </label>

                    <button onClick={() => { downloadFile("roles.json", roles.exportData()); }}>
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
                        {showCreate ? "Close" : "New Role"}
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
                                placeholder="e.g., Frontend Developer"
                                required
                            />
                        </div>
                        <div>
                            <label>Department</label>
                            <input
                                value={draft.department}
                                onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
                                placeholder="Engineering / HR / Sales"
                            />
                        </div>
                        <div>
                            <label>Level</label>
                            <input
                                value={draft.level}
                                onChange={(e) => setDraft((d) => ({ ...d, level: e.target.value }))}
                                placeholder="1"
                                inputMode="numeric"
                                pattern="[0-9]*"
                            />
                        </div>
                        <div className="span2">
                            <label>Description</label>
                            <textarea
                                rows={2}
                                value={draft.description}
                                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                placeholder="Optional notes"
                            />
                        </div>
                        <div className="inline">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={draft.isDefault}
                                    onChange={(e) => setDraft((d) => ({ ...d, isDefault: e.target.checked }))}
                                />
                                <span>Default role for new hires</span>
                            </label>
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
                            <th onClick={() => onHeaderSort("department")} role="button">Department <SortChev col="department" /></th>
                            <th onClick={() => onHeaderSort("level")} role="button">Level <SortChev col="level" /></th>
                            <th onClick={() => onHeaderSort("updatedAt")} role="button">Updated <SortChev col="updatedAt" /></th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.view.length === 0 && (
                            <tr>
                                <td colSpan={6}>
                                    <Styled.Empty>
                                        <div className="hint">
                                            {roles.search ? "No roles match your search." : "No roles yet. Add the first one using 'New Role'."}
                                        </div>
                                    </Styled.Empty>
                                </td>
                            </tr>
                        )}

                        {roles.view.map((r) => (
                            <tr key={r.id} data-deleted={r.isDeleted ? "true" : "false"}>
                                <td>
                                    <NavLink
                                        to={`/roles/${r.id}`}
                                        title="Open detail"
                                        onClick={() => roles.markRecent(r.id)}
                                        className="rowLink"
                                    >
                                        {r.name || <em>Untitled</em>}
                                    </NavLink>
                                    <div className="id">{r.id}</div>
                                </td>
                                <td>{r.department || "-"}</td>
                                <td>{r.level ?? "-"}</td>
                                <td><span className="muted">{r.updatedAt}</span></td>
                                <td>
                                    {r.isDeleted ? (
                                        <span className="pill danger">Deleted</span>
                                    ) : r.isDefault ? (
                                        <span className="pill ok">Default</span>
                                    ) : (
                                        <span className="pill">Active</span>
                                    )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    {!r.isDeleted && (
                                        <>
                                            <button onClick={() => { roles.markRecent(r.id); navigate(`/roles/${r.id}/edit`); }}>
                                                Edit
                                            </button>
                                            <button onClick={() => requestDelete(r.id)} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {r.isDeleted && (
                                        <button onClick={() => requestRestore(r.id)} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
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
                title={confirm.mode === "delete" ? "Delete role?" : "Restore role?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later from 'Show deleted'."
                        : "The role will be restored and appear in the active list."
                }
                onConfirm={performConfirm}
                onCancel={() => setConfirm({ open: false, id: null, mode: "delete" })}
            />
        </Styled.Page>
    );
}
