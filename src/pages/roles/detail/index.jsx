import React, { useMemo, useState, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";

/* light confirm overlay */
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

export default function RoleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // roles + employees (for assignment count)
    const roles = useLocalCollection("roles", { searchFields: ["name", "description", "id"] });
    const employees = useLocalCollection("employees", { searchFields: ["name", "role", "id"] });

    // pick role and mark recent
    const role = useMemo(() => roles.get(id), [id, roles]);

    // if role doesn't exist, simple empty state
    if (!role) {
        return (
            <Styled.Page>
                <Styled.Breadcrumbs>
                    <NavLink to="/home">Home</NavLink> <span>›</span>
                    <NavLink to="/roles">Roles</NavLink> <span>›</span>
                    <span className="current">Not found</span>
                </Styled.Breadcrumbs>

                <Styled.NoticeCard>
                    <h3>Role not found</h3>
                    <p className="muted">The requested role does not exist or was removed.</p>
                    <div className="actions">
                        <NavLink to="/roles" className="btn">Back to roles</NavLink>
                    </div>
                </Styled.NoticeCard>
            </Styled.Page>
        );
    }

    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    const assignments = useMemo(() => {
        const name = (role.name || "").toLowerCase();
        const list = employees.items.filter(
            (e) => !e.isDeleted && (e.role || "").toLowerCase() === name
        );
        return { count: list.length, list: list.slice(0, 6) }; // show top 6
    }, [employees.items, role.name]);

    // dynamic permissions support: array or comma string
    const permissions = useMemo(() => {
        const arr = Array.isArray(role.permissions)
            ? role.permissions
            : typeof role.permissions === "string"
                ? role.permissions.split(",")
                : Array.isArray(role.scopes)
                    ? role.scopes
                    : typeof role.scopes === "string"
                        ? role.scopes.split(",")
                        : [];
        return arr.map((s) => s.trim()).filter(Boolean);
    }, [role.permissions, role.scopes]);

    const deleteRole = () => {
        roles.remove(role.id);
        setConfirm({ open: false, mode: "delete" });
    };
    const restoreRole = () => {
        roles.restore(role.id);
        setConfirm({ open: false, mode: "delete" });
    };

    // ensure recent mark if user deep-linked and didn't trigger roles.get earlier
    useEffect(() => { roles.markRecent(role.id); }, [roles, role.id]);

    return (
        <Styled.Page>
            <Styled.Breadcrumbs>
                <NavLink to="/home">Home</NavLink> <span>›</span>
                <NavLink to="/roles">Roles</NavLink> <span>›</span>
                <span className="current">{role.name || "Untitled Role"}</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>{role.name || "Untitled Role"}</h3>
                    <p className="muted">
                        {role.description || "Role definition for access and responsibilities."}
                    </p>
                </div>

                <div className="right">
                    {!role.isDeleted && (
                        <button onClick={() => navigate(`/roles/${role.id}/edit`)}>Edit</button>
                    )}
                    {!role.isDeleted && (
                        <button
                            onClick={() => setConfirm({ open: true, mode: "delete" })}
                            style={{ color: "var(--danger)", borderColor: "var(--danger)" }}
                        >
                            Delete
                        </button>
                    )}
                    {role.isDeleted && (
                        <button
                            onClick={() => setConfirm({ open: true, mode: "restore" })}
                            style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
                        >
                            Restore
                        </button>
                    )}
                    <NavLink to="/roles" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            {role.isDeleted && (
                <Styled.WarningBar>
                    This role is <strong>deleted</strong>. You can restore it to make it active again.
                </Styled.WarningBar>
            )}

            <Styled.InfoGrid>
                <div className="card">
                    <div className="label">Role ID</div>
                    <div className="value mono">{role.id}</div>
                </div>
                <div className="card">
                    <div className="label">Status</div>
                    <div className="value">
                        {role.isDeleted ? (
                            <span className="pill danger">Deleted</span>
                        ) : (
                            <span className="pill ok">Active</span>
                        )}
                    </div>
                </div>
                <div className="card">
                    <div className="label">Created at</div>
                    <div className="value muted">{role.createdAt || "-"}</div>
                </div>
                <div className="card">
                    <div className="label">Updated at</div>
                    <div className="value muted">{role.updatedAt || "-"}</div>
                </div>
            </Styled.InfoGrid>

            <Styled.Section>
                <h4>Permissions</h4>
                {permissions.length === 0 ? (
                    <p className="muted">No permissions listed.</p>
                ) : (
                    <div className="chips">
                        {permissions.map((p) => (
                            <span key={p} className="chip">{p}</span>
                        ))}
                    </div>
                )}
            </Styled.Section>

            <Styled.Section>
                <h4>Assigned employees <span className="muted">({assignments.count})</span></h4>
                {assignments.count === 0 ? (
                    <p className="muted">No employees currently assigned to this role.</p>
                ) : (
                    <ul className="list">
                        {assignments.list.map((e) => (
                            <li key={e.id}>
                                <NavLink to={`/employees/${e.id}`} onClick={() => employees.markRecent(e.id)}>
                                    {e.name || "Unnamed"} <span className="muted mono">({e.id})</span>
                                </NavLink>
                            </li>
                        ))}
                        {assignments.count > assignments.list.length && (
                            <li className="muted">…and {assignments.count - assignments.list.length} more</li>
                        )}
                    </ul>
                )}
            </Styled.Section>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete role?" : "Restore role?"}
                message={
                    confirm.mode === "delete"
                        ? "Soft delete only. You can restore it later from the Roles list."
                        : "The role will be restored and shown as active."
                }
                onConfirm={confirm.mode === "delete" ? deleteRole : restoreRole}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
