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
                position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
                display: "grid", placeItems: "center", zIndex: 9999
            }}
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(560px,92vw)",
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    boxShadow: "var(--shadow)",
                    padding: 16
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

export default function EmployeeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const emps = useLocalCollection("employees", {
        searchFields: ["name", "email", "phone", "department", "role", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    // get item; will also mark recent
    const emp = useMemo(() => emps.get(id), [id, emps]);

    // local confirm state
    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    useEffect(() => {
        // if someone deletes from another tab, keep this page in sync
        // emps.refresh exposed already, but hook events handle it too
    }, []);

    if (!emp) {
        return (
            <Styled.Page>
                <Styled.Breadcrumbs aria-label="Breadcrumbs">
                    <NavLink to="/home">Home</NavLink>
                    <span>›</span>
                    <NavLink to="/employees">Employees</NavLink>
                    <span>›</span>
                    <span className="current">Not found</span>
                </Styled.Breadcrumbs>

                <Styled.MissingCard>
                    <h3>Employee not found</h3>
                    <p className="muted">
                        This record doesn’t exist or was removed. Go back to the list or create a new one.
                    </p>
                    <div className="actions">
                        <NavLink to="/employees" className="btn">Back to list</NavLink>
                        <NavLink to="/employees/new" className="btn">Create new</NavLink>
                    </div>
                </Styled.MissingCard>
            </Styled.Page>
        );
    }

    const onToggleDisable = () => {
        emps.update(emp.id, { isDisabled: !emp.isDisabled });
    };

    const onDelete = () => setConfirm({ open: true, mode: "delete" });
    const onRestore = () => setConfirm({ open: true, mode: "restore" });

    const doConfirm = () => {
        if (confirm.mode === "delete") emps.remove(emp.id);
        if (confirm.mode === "restore") emps.restore(emp.id);
        setConfirm({ open: false, mode: "delete" });
    };

    const copyId = async () => {
        try { await navigator.clipboard.writeText(emp.id); } catch { }
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/employees">Employees</NavLink>
                <span>›</span>
                <span className="current">{emp.name || "Employee"}</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>{emp.name || "Unnamed employee"}</h3>
                    <div className="meta">
                        <span className={`pill ${emp.isDeleted ? "danger" : emp.isDisabled ? "warn" : "ok"}`}>
                            {emp.isDeleted ? "Deleted" : emp.isDisabled ? "Disabled" : "Active"}
                        </span>
                        <span className="muted">Updated: {emp.updatedAt}</span>
                    </div>
                </div>
                <div className="right">
                    {!emp.isDeleted && (
                        <>
                            <button onClick={() => navigate(`/employees/${emp.id}/edit`)}>Edit</button>
                            <button onClick={onToggleDisable}>{emp.isDisabled ? "Enable" : "Disable"}</button>
                            <button onClick={onDelete} style={{ color: "var(--danger)", borderColor: "var(--danger)" }}>Delete</button>
                        </>
                    )}
                    {emp.isDeleted && (
                        <button onClick={onRestore} style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>
                            Restore
                        </button>
                    )}
                    <NavLink className="btn" to="/employees">Back</NavLink>
                </div>
            </Styled.Header>

            <Styled.Card>
                <div className="grid">
                    <div>
                        <div className="label">Name</div>
                        <div className="value">{emp.name || "-"}</div>
                    </div>

                    <div>
                        <div className="label">Email</div>
                        <div className="value">
                            {emp.email ? <a href={`mailto:${emp.email}`}>{emp.email}</a> : "-"}
                        </div>
                    </div>

                    <div>
                        <div className="label">Phone</div>
                        <div className="value">
                            {emp.phone ? <a href={`tel:${emp.phone}`}>{emp.phone}</a> : "-"}
                        </div>
                    </div>

                    <div>
                        <div className="label">Department</div>
                        <div className="value">{emp.department || "-"}</div>
                    </div>

                    <div>
                        <div className="label">Role</div>
                        <div className="value">{emp.role || "-"}</div>
                    </div>

                    <div>
                        <div className="label">Join Date</div>
                        <div className="value">{emp.joinDate || "-"}</div>
                    </div>

                    <div>
                        <div className="label">Salary</div>
                        <div className="value">{emp.salary != null && emp.salary !== "" ? `₹ ${emp.salary}` : "-"}</div>
                    </div>

                    <div className="span2">
                        <div className="label">Notes</div>
                        <div className="value">{emp.notes || "-"}</div>
                    </div>
                </div>
            </Styled.Card>

            <Styled.MetaCard>
                <div className="row">
                    <div>
                        <div className="label">Employee ID</div>
                        <div className="value id">
                            <code>{emp.id}</code>
                            <button className="mini" onClick={copyId} title="Copy ID">Copy</button>
                        </div>
                    </div>
                    <div>
                        <div className="label">Created at</div>
                        <div className="value">{emp.createdAt || "-"}</div>
                    </div>
                    <div>
                        <div className="label">Updated at</div>
                        <div className="value">{emp.updatedAt || "-"}</div>
                    </div>
                </div>
            </Styled.MetaCard>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete employee?" : "Restore employee?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore later from the list (Show deleted)."
                        : "The employee will be restored and appear in the active list."
                }
                onConfirm={doConfirm}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
