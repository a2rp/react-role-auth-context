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
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
                display: "grid", placeItems: "center", zIndex: 9999,
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(560px, 92vw)",
                    background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 16,
                }}
            >
                <h4 style={{ margin: "0 0 8px 0" }}>{title}</h4>
                <p style={{ margin: 0, color: "var(--muted)" }}>{message}</p>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
                    <button onClick={onCancel}>Cancel</button>
                    <button onClick={onConfirm} style={{ background: "var(--danger)", borderColor: "var(--danger)", color: "#fff" }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function DepartmentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const deps = useLocalCollection("departments", {
        searchFields: ["name", "code", "manager", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    // employees (for headcount + list)
    const emps = useLocalCollection("employees", {
        searchFields: ["name", "department", "role", "email"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const dep = useMemo(() => deps.get(id), [deps, id]);
    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    useEffect(() => {
        if (dep?.id) deps.markRecent(dep.id);
    }, [dep?.id, deps]);

    const deptEmployees = useMemo(() => {
        if (!dep) return [];
        const name = String(dep.name || "").toLowerCase().trim();
        return emps.items.filter(
            (e) => !e.isDeleted && String(e.department || "").toLowerCase().trim() === name
        );
    }, [dep, emps.items]);

    if (!dep) {
        return (
            <Styled.Page>
                <Styled.Breadcrumbs>
                    <NavLink to="/home">Home</NavLink><span>›</span>
                    <NavLink to="/departments">Departments</NavLink><span>›</span>
                    <span className="current">Not found</span>
                </Styled.Breadcrumbs>

                <Styled.NoticeCard>
                    <h3>Department not found</h3>
                    <p className="muted">The requested department does not exist or was removed.</p>
                    <div className="actions">
                        <NavLink to="/departments" className="btn">Back to list</NavLink>
                    </div>
                </Styled.NoticeCard>
            </Styled.Page>
        );
    }

    const onDelete = () => setConfirm({ open: true, mode: "delete" });
    const onRestore = () => setConfirm({ open: true, mode: "restore" });

    const doConfirm = () => {
        if (confirm.mode === "delete") deps.remove(dep.id);
        else deps.restore(dep.id);
        setConfirm({ open: false, mode: "delete" });
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink><span>›</span>
                <NavLink to="/departments">Departments</NavLink><span>›</span>
                <span className="current">{dep.name || "Untitled"}</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>{dep.name || "Untitled department"}</h3>
                    <div className="sub">
                        <span className="muted">ID:</span> <code className="id">{dep.id}</code>
                        {dep.isDeleted ? <span className="pill danger">Deleted</span> : <span className="pill ok">Active</span>}
                    </div>
                </div>
                <div className="right">
                    <NavLink to="/departments" className="btn ghost">Back</NavLink>
                    <button
                        onClick={() => navigate(`/departments/${dep.id}/edit`)}
                        disabled={dep.isDeleted}
                        title={dep.isDeleted ? "Restore to edit" : "Edit department"}
                    >
                        Edit
                    </button>
                    {!dep.isDeleted ? (
                        <button onClick={onDelete} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>
                            Delete
                        </button>
                    ) : (
                        <button onClick={onRestore} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                            Restore
                        </button>
                    )}
                </div>
            </Styled.Header>

            <Styled.MetaCard>
                <div>
                    <div className="label">Code</div>
                    <div className="value">{dep.code || "-"}</div>
                </div>
                <div>
                    <div className="label">Manager</div>
                    <div className="value">{dep.manager || "-"}</div>
                </div>
                <div>
                    <div className="label">Headcount (active)</div>
                    <div className="value">{deptEmployees.length}</div>
                </div>
                <div>
                    <div className="label">Created</div>
                    <div className="value">{dep.createdAt || "-"}</div>
                </div>
                <div>
                    <div className="label">Updated</div>
                    <div className="value">{dep.updatedAt || "-"}</div>
                </div>
                <div className="span2">
                    <div className="label">Notes</div>
                    <div className="value">{dep.notes || <span className="muted">—</span>}</div>
                </div>
            </Styled.MetaCard>

            <Styled.SectionCard>
                <div className="sectionHeader">
                    <h4>Employees in “{dep.name || "-"}”</h4>
                    <div className="actions">
                        <NavLink to="/employees" className="btn">Open Employees</NavLink>
                    </div>
                </div>

                <Styled.TableWrap>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Email</th>
                                <th>Updated</th>
                                <th style={{ textAlign: "right" }}>Open</th>
                            </tr>
                        </thead>
                        <tbody>
                            {deptEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={5}>
                                        <Styled.Empty><div className="hint">No active employees found in this department.</div></Styled.Empty>
                                    </td>
                                </tr>
                            )}
                            {deptEmployees.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.name || <em>Unnamed</em>}</td>
                                    <td>{e.role || "-"}</td>
                                    <td>{e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : "-"}</td>
                                    <td><span className="muted">{e.updatedAt}</span></td>
                                    <td style={{ textAlign: "right" }}>
                                        <NavLink to={`/employees/${e.id}`} className="btn small">View</NavLink>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Styled.TableWrap>
            </Styled.SectionCard>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete department?" : "Restore department?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later."
                        : "The department will be restored."
                }
                onConfirm={doConfirm}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
