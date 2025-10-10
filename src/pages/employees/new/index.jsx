import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";
import { localdb } from "../../../store/localdb";

const toYMD = (d = new Date()) => {
    const z = (n) => String(n).padStart(2, "0");
    const y = d.getFullYear();
    const m = z(d.getMonth() + 1);
    const day = z(d.getDate());
    return `${y}-${m}-${day}`;
};

const initialDraft = {
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    joinDate: toYMD(),
    salary: "",
    isDisabled: false,
    notes: "",
};

export default function EmployeeNew() {
    const navigate = useNavigate();
    const emps = useLocalCollection("employees", {
        searchFields: ["name", "email", "phone", "department", "role", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [draft, setDraft] = useState(initialDraft);
    const [errors, setErrors] = useState({});

    const canSave = useMemo(() => {
        if (!draft.name.trim()) return false;
        if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) return false;
        if (draft.salary && Number.isNaN(Number(draft.salary))) return false;
        return true;
    }, [draft]);

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => ({ ...d, [key]: val }));
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Name is required";
        if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = "Invalid email";
        if (draft.salary && Number.isNaN(Number(draft.salary))) next.salary = "Salary must be a number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const id = emps.create({
            name: draft.name.trim(),
            email: draft.email.trim(),
            phone: draft.phone.trim(),
            department: draft.department.trim(),
            role: draft.role.trim(),
            joinDate: draft.joinDate,
            salary: draft.salary ? Number(draft.salary) : null,
            isDisabled: !!draft.isDisabled,
            notes: draft.notes.trim(),
            createdAt: localdb.nowISTLabel(),
        });

        navigate(`/employees/${id}`);
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/employees">Employees</NavLink>
                <span>›</span>
                <span className="current">New</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>New Employee</h3>
                    <p className="muted">Add a new team member to your Employee Management System.</p>
                </div>
                <div className="right">
                    <NavLink to="/employees" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit} noValidate>
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
                            value={draft.joinDate}
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
                    <NavLink to="/employees" className="btn ghost">Cancel</NavLink>
                    <button type="submit" disabled={!canSave}>Save Employee</button>
                </div>
            </Styled.FormCard>

            <Styled.HintCard>
                <div className="row">
                    <div>
                        <div className="label">Created at (IST)</div>
                        <div className="value">{localdb.nowISTLabel()}</div>
                    </div>
                    <div>
                        <div className="label">Will appear in</div>
                        <div className="value">Employees → List (sorted by Updated)</div>
                    </div>
                </div>
            </Styled.HintCard>
        </Styled.Page>
    );
}
