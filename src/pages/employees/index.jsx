// src/pages/employees/index.jsx
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
const FIELDS_FOR_SEARCH = ["name", "email", "phone", "department", "role", "id"];

export default function Employees() {
    const navigate = useNavigate();
    const fileRef = useRef(null);
    const [confirm, setConfirm] = useState({ open: false, id: null, mode: "delete" });

    const emps = useLocalCollection("employees", {
        searchFields: FIELDS_FOR_SEARCH,
        sortInitial: DEFAULT_SORT,
    });

    // inline create panel
    const [showCreate, setShowCreate] = useState(false);
    const [draft, setDraft] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        isDisabled: false,
    });

    const counts = useMemo(() => {
        const total = emps.items.length;
        const active = emps.items.filter((x) => !x.isDeleted).length;
        const deleted = total - active;
        return { total, active, deleted };
    }, [emps.items]);

    const onCreate = (e) => {
        e.preventDefault();
        const name = draft.name?.trim();
        if (!name) return;
        const id = emps.create({
            ...draft,
            name,
            email: draft.email?.trim(),
            phone: draft.phone?.trim(),
            department: draft.department?.trim(),
            role: draft.role?.trim(),
            isDisabled: !!draft.isDisabled,
            isDeleted: false,
        });
        setShowCreate(false);
        setDraft({ name: "", email: "", phone: "", department: "", role: "", isDisabled: false });
        navigate(`/employees/${id}`);
    };

    const requestDelete = (id) => setConfirm({ open: true, id, mode: "delete" });
    const requestRestore = (id) => setConfirm({ open: true, id, mode: "restore" });

    const performConfirm = () => {
        const { id, mode } = confirm;
        if (!id) return setConfirm({ open: false, id: null, mode: "delete" });
        if (mode === "delete") emps.remove(id);
        if (mode === "restore") emps.restore(id);
        setConfirm({ open: false, id: null, mode: "delete" });
    };

    const importJSON = async (file) => {
        if (!file) return;
        try {
            const text = await file.text();
            const arr = JSON.parse(text);
            const res = emps.importData(arr, { mode: "replace" });
            console.info(`Imported ${res.count} employees [${res.mode}]`);
        } catch (e) {
            console.error("Import failed:", e);
        }
    };

    const onHeaderSort = (key) => {
        emps.setSort((prev) => {
            const dir = prev.by === key ? (prev.dir === "asc" ? "desc" : "asc") : "asc";
            return { by: key, dir };
        });
    };

    const SortChev = ({ col }) => {
        const active = emps.sort.by === col;
        const dir = emps.sort.dir;
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
                    <h3>Employees</h3>
                    <p className="muted">Create, search, edit, disable, and manage employees. LocalStorage only.</p>
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
                        placeholder="Search name/email/phone/department/role"
                        value={emps.search}
                        onChange={(e) => emps.setSearch(e.target.value)}
                        aria-label="Search employees"
                    />
                </div>
                <div className="right">
                    <label className="toggle">
                        <input
                            type="checkbox"
                            checked={emps.showDeleted}
                            onChange={(e) => emps.setShowDeleted(e.target.checked)}
                        />
                        <span>Show deleted</span>
                    </label>

                    <button onClick={() => { downloadFile("employees.json", emps.exportData()); }}>
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
                        {showCreate ? "Close" : "New Employee"}
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
                                placeholder="e.g., Priya Sharma"
                                required
                            />
                        </div>
                        <div>
                            <label>Email</label>
                            <input
                                value={draft.email}
                                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
                                placeholder="name@company.com"
                                type="email"
                            />
                        </div>
                        <div>
                            <label>Phone</label>
                            <input
                                value={draft.phone}
                                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                                placeholder="9876543210"
                                inputMode="tel"
                                pattern="[0-9 +\\-]*"
                                autoComplete="tel"
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
                            <label>Role</label>
                            <input
                                value={draft.role}
                                onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
                                placeholder="Frontend Dev / Manager"
                            />
                        </div>
                        <div className="inline">
                            <label className="toggle">
                                <input
                                    type="checkbox"
                                    checked={draft.isDisabled}
                                    onChange={(e) => setDraft((d) => ({ ...d, isDisabled: e.target.checked }))}
                                />
                                <span>Disabled (cannot login)</span>
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
                            <th onClick={() => onHeaderSort("role")} role="button">Role <SortChev col="role" /></th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th onClick={() => onHeaderSort("updatedAt")} role="button">Updated <SortChev col="updatedAt" /></th>
                            <th>Status</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {emps.view.length === 0 && (
                            <tr>
                                <td colSpan={8}>
                                    <Styled.Empty>
                                        <div className="hint">
                                            {emps.search
                                                ? "No employees match your search."
                                                : "No employees yet. Add the first one using 'New Employee'."}
                                        </div>
                                    </Styled.Empty>
                                </td>
                            </tr>
                        )}

                        {emps.view.map((e) => (
                            <tr key={e.id} data-deleted={e.isDeleted ? "true" : "false"}>
                                <td>
                                    <NavLink
                                        to={`/employees/${e.id}`}
                                        title="Open detail"
                                        onClick={() => emps.markRecent(e.id)}
                                        className="rowLink"
                                    >
                                        {e.name || <em>Unnamed</em>}
                                    </NavLink>
                                    <div className="id">{e.id}</div>
                                </td>
                                <td>{e.department || "-"}</td>
                                <td>{e.role || "-"}</td>
                                <td>
                                    {e.email ? (
                                        <a href={`mailto:${e.email}`} title="Email">{e.email}</a>
                                    ) : "-"}
                                </td>
                                <td>
                                    {e.phone ? (
                                        <a href={`tel:${e.phone}`} title="Call">{e.phone}</a>
                                    ) : "-"}
                                </td>
                                <td><span className="muted">{e.updatedAt}</span></td>
                                <td>
                                    {e.isDeleted ? (
                                        <span className="pill danger">Deleted</span>
                                    ) : e.isDisabled ? (
                                        <span className="pill warn">Disabled</span>
                                    ) : (
                                        <span className="pill ok">Active</span>
                                    )}
                                </td>
                                <td style={{ textAlign: "right" }}>
                                    {!e.isDeleted && (
                                        <>
                                            <button onClick={() => { emps.markRecent(e.id); navigate(`/employees/${e.id}/edit`); }}>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => emps.update(e.id, { isDisabled: !e.isDisabled })}
                                                title={e.isDisabled ? "Enable" : "Disable"}
                                            >
                                                {e.isDisabled ? "Enable" : "Disable"}
                                            </button>
                                            <button onClick={() => requestDelete(e.id)} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {e.isDeleted && (
                                        <button onClick={() => requestRestore(e.id)} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
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
                title={confirm.mode === "delete" ? "Delete employee?" : "Restore employee?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later from 'Show deleted'."
                        : "The employee will be restored and appear in the active list."
                }
                onConfirm={performConfirm}
                onCancel={() => setConfirm({ open: false, id: null, mode: "delete" })}
            />
        </Styled.Page>
    );
}
