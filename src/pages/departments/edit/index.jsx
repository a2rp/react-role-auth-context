import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";

/* lightweight confirm */
function ConfirmOverlay({ open, title, message, onConfirm, onCancel }) {
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

const emptyDraft = { name: "", code: "", manager: "", notes: "" };

export default function DepartmentEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const deps = useLocalCollection("departments", {
        searchFields: ["name", "code", "manager", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [draft, setDraft] = useState(emptyDraft);
    const [errors, setErrors] = useState({});
    const [notFound, setNotFound] = useState(false);
    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    // load record
    useEffect(() => {
        const rec = deps.get(id);
        if (!rec) {
            setNotFound(true);
            return;
        }
        setDraft({
            name: rec.name || "",
            code: rec.code || "",
            manager: rec.manager || "",
            notes: rec.notes || "",
        });
    }, [id]); // deps.get already marks recent

    const rec = useMemo(() => deps.items.find((x) => x.id === id) || null, [deps.items, id]);

    const canSave = useMemo(() => draft.name.trim().length > 0, [draft]);

    const onChange = (key) => (e) => setDraft((d) => ({ ...d, [key]: e.target.value }));

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        deps.update(id, {
            name: draft.name.trim(),
            code: draft.code.trim(),
            manager: draft.manager.trim(),
            notes: draft.notes.trim(),
        });
        navigate(`/departments/${id}`);
    };

    const doDelete = () => { deps.remove(id); setConfirm({ open: false, mode: "delete" }); };
    const doRestore = () => { deps.restore(id); setConfirm({ open: false, mode: "restore" }); };

    if (notFound) {
        return (
            <Styled.Page>
                <Styled.Breadcrumbs>
                    <NavLink to="/home">Home</NavLink><span>›</span>
                    <NavLink to="/departments">Departments</NavLink><span>›</span>
                    <span className="current">Not found</span>
                </Styled.Breadcrumbs>

                <Styled.Notice>
                    <h4>Department not found</h4>
                    <p className="muted">Record with id <code>{id}</code> is missing or deleted permanently.</p>
                    <NavLink to="/departments" className="btn">Back to list</NavLink>
                </Styled.Notice>
            </Styled.Page>
        );
    }

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink><span>›</span>
                <NavLink to="/departments">Departments</NavLink><span>›</span>
                <NavLink to={`/departments/${id}`}>Detail</NavLink><span>›</span>
                <span className="current">Edit</span>
            </Styled.Breadcrumbs>

            <Styled.Header data-deleted={rec?.isDeleted ? "true" : "false"}>
                <div className="left">
                    <h3>Edit Department</h3>
                    <p className="muted">
                        ID: <code>{id}</code>
                        {rec?.updatedAt ? <span> • Updated: {rec.updatedAt}</span> : null}
                    </p>
                </div>
                <div className="right">
                    <NavLink to={`/departments/${id}`} className="linkBtn">Back to detail</NavLink>
                    <NavLink to="/departments" className="linkBtn">List</NavLink>
                </div>
            </Styled.Header>

            {rec?.isDeleted && (
                <Styled.WarnCard>
                    <div className="msg">
                        <strong>Note:</strong> This department is currently <span className="pill danger">Deleted</span>.
                    </div>
                    <div className="actions">
                        <button onClick={() => setConfirm({ open: true, mode: "restore" })}>Restore</button>
                    </div>
                </Styled.WarnCard>
            )}

            <Styled.FormCard as="form" onSubmit={onSubmit}>
                <div className="grid">
                    <div>
                        <label>Name <span className="req">*</span></label>
                        <input
                            value={draft.name}
                            onChange={onChange("name")}
                            placeholder="e.g., Engineering"
                            autoFocus
                            required
                        />
                        {errors.name && <div className="err">{errors.name}</div>}
                    </div>

                    <div>
                        <label>Code</label>
                        <input
                            value={draft.code}
                            onChange={onChange("code")}
                            placeholder="ENG / HR / SALES"
                        />
                    </div>

                    <div className="span2">
                        <label>Manager / Lead</label>
                        <input
                            value={draft.manager}
                            onChange={onChange("manager")}
                            placeholder="e.g., Priya Sharma"
                        />
                    </div>

                    <div className="span2">
                        <label>Notes</label>
                        <textarea
                            rows={3}
                            value={draft.notes}
                            onChange={onChange("notes")}
                            placeholder="Optional remarks or responsibilities"
                        />
                    </div>
                </div>

                <div className="actions">
                    {!rec?.isDeleted && (
                        <button
                            type="button"
                            className="danger"
                            onClick={() => setConfirm({ open: true, mode: "delete" })}
                            title="Soft delete"
                        >
                            Delete
                        </button>
                    )}
                    <div className="spacer" />
                    <NavLink to={`/departments/${id}`} className="btn ghost">Cancel</NavLink>
                    <button type="submit" disabled={!canSave}>Save Changes</button>
                </div>
            </Styled.FormCard>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete department?" : "Restore department?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later."
                        : "This will restore the department to the active list."
                }
                onConfirm={confirm.mode === "delete" ? doDelete : doRestore}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
