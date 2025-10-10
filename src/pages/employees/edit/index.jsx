import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";

/* lightweight confirm overlay */
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

const EMPTY = {
    name: "", email: "", phone: "", department: "", role: "",
    joinDate: "", salary: "", isDisabled: false, notes: "",
};

export default function EmployeeEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const emps = useLocalCollection("employees", {
        searchFields: ["name", "email", "phone", "department", "role", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    // find record
    const record = useMemo(
        () => emps.items.find((x) => x.id === id) || null,
        [emps.items, id]
    );

    // prime draft when record available
    const [draft, setDraft] = useState(EMPTY);
    useEffect(() => {
        if (record) {
            setDraft({
                name: record.name || "",
                email: record.email || "",
                phone: record.phone || "",
                department: record.department || "",
                role: record.role || "",
                joinDate: record.joinDate || "",
                salary: record.salary ?? "",
                isDisabled: !!record.isDisabled,
                notes: record.notes || "",
            });
            emps.markRecent(record.id);
        }
    }, [record]); // eslint-disable-line

    const [errors, setErrors] = useState({});
    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => ({ ...d, [key]: val }));
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Name is required";
        if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = "Invalid email";
        if (draft.salary !== "" && Number.isNaN(Number(draft.salary))) next.salary = "Salary must be a number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!record) return;
        if (!validate()) return;

        emps.update(record.id, {
            name: draft.name.trim(),
            email: draft.email.trim(),
            phone: draft.phone.trim(),
            department: draft.department.trim(),
            role: draft.role.trim(),
            joinDate: draft.joinDate || null,
            salary: draft.salary === "" ? null : Number(draft.salary),
            isDisabled: !!draft.isDisabled,
            notes: draft.notes.trim(),
        });
        navigate(`/employees/${record.id}`);
    };

    const doDelete = () => {
        if (!record) return;
        emps.remove(record.id);
        setConfirm({ open: false, mode: "delete" });
        navigate("/employees");
    };

    const doRestore = () => {
        if (!record) return;
        emps.restore(record.id);
        setConfirm({ open: false, mode: "restore" });
        navigate(`/employees/${record.id}`);
    };

    if (!record) {
        return (
            <Styled.Page>
                <Styled.Notice>
                    <h3>Employee not found</h3>
                    <p className="muted">The record you’re trying to edit doesn’t exist.</p>
                    <div className="actions">
                        <NavLink to="/employees" className="btn">Back to list</NavLink>
                        <NavLink to="/employees/new" className="btn">Create new</NavLink>
                    </div>
                </Styled.Notice>
            </Styled.Page>
        );
    }

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/employees">Employees</NavLink>
                <span>›</span>
                <NavLink to={`/employees/${record.id}`}>{record.name || "Detail"}</NavLink>
                <span>›</span>
                <span className="current">Edit</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>Edit Employee</h3>
                    <p className="muted">ID: <span className="mono">{record.id}</span></p>
                </div>
                <div className="right">
                    <NavLink to={`/employees/${record.id}`} className="linkBtn">Back to detail</NavLink>
                    <NavLink to="/employees" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit}>
                <div className="grid">
                    <div>
                        <label>Name <span className="req">*</span></label>
                        <input
                            value={draft.name}
                            onChange={onChange("name")}
                            placeholder="e.g., Priya Sharma"
                            autoFocus
                            required
                        />
                        {errors.name && <div className="err">{errors.name}</div>}
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={draft.email}
                            onChange={onChange("email")}
                            placeholder="name@company.com"
                        />
                        {errors.email && <div className="err">{errors.email}</div>}
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            value={draft.phone}
                            onChange={onChange("phone")}
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
                            onChange={onChange("department")}
                            placeholder="Engineering / HR / Sales"
                        />
                    </div>

                    <div>
                        <label>Role</label>
                        <input
                            value={draft.role}
                            onChange={onChange("role")}
                            placeholder="Frontend Dev / Manager"
                        />
                    </div>

                    <div>
                        <label>Join Date</label>
                        <input
                            type="date"
                            value={draft.joinDate || ""}
                            onChange={onChange("joinDate")}
                        />
                    </div>

                    <div>
                        <label>Salary (₹ / month)</label>
                        <input
                            value={draft.salary}
                            onChange={onChange("salary")}
                            placeholder="50000"
                            inputMode="numeric"
                        />
                        {errors.salary && <div className="err">{errors.salary}</div>}
                    </div>

                    <div className="inline">
                        <label className="toggle">
                            <input type="checkbox" checked={draft.isDisabled} onChange={onChange("isDisabled")} />
                            <span>Disabled (cannot login)</span>
                        </label>
                    </div>

                    <div className="span2">
                        <label>Notes</label>
                        <textarea
                            rows={3}
                            value={draft.notes}
                            onChange={onChange("notes")}
                            placeholder="Optional remarks"
                        />
                    </div>
                </div>

                <div className="actions">
                    <NavLink to={`/employees/${record.id}`} className="btn ghost">Cancel</NavLink>
                    <button type="submit">Save Changes</button>
                </div>
            </Styled.FormCard>

            <Styled.MetaRow>
                <div>
                    <div className="label">Created</div>
                    <div className="value">{record.createdAt || "-"}</div>
                </div>
                <div>
                    <div className="label">Last Updated</div>
                    <div className="value">{record.updatedAt || "-"}</div>
                </div>
                <div>
                    <div className="label">Status</div>
                    <div className="value">
                        {record.isDeleted ? (
                            <span className="pill danger">Deleted</span>
                        ) : record.isDisabled ? (
                            <span className="pill warn">Disabled</span>
                        ) : (
                            <span className="pill ok">Active</span>
                        )}
                    </div>
                </div>
            </Styled.MetaRow>

            <Styled.DangerCard>
                <h4>Danger zone</h4>
                {record.isDeleted ? (
                    <>
                        <p className="muted">This employee is currently marked as deleted.</p>
                        <div className="actions">
                            <button className="btn" onClick={() => setConfirm({ open: true, mode: "restore" })}>
                                Restore
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="muted">Soft delete hides the employee from the active list. You can restore later.</p>
                        <div className="actions">
                            <button className="btn danger" onClick={() => setConfirm({ open: true, mode: "delete" })}>
                                Delete
                            </button>
                        </div>
                    </>
                )}
            </Styled.DangerCard>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete employee?" : "Restore employee?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later from the list view (Show deleted)."
                        : "The employee will be restored and appear in the active list."
                }
                onConfirm={confirm.mode === "delete" ? doDelete : doRestore}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
