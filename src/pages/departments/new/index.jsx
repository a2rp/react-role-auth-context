import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";
import { localdb } from "../../../store/localdb";

const toYMD = (d = new Date()) => {
    const z = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}`;
};

const initialDraft = {
    name: "",
    code: "",
    manager: "",
    location: "",
    email: "",
    phone: "",
    establishedOn: toYMD(),
    budget: "",
    isArchived: false,
    notes: "",
};

export default function DepartmentsNew() {
    const navigate = useNavigate();
    const depts = useLocalCollection("departments", {
        searchFields: ["name", "code", "manager", "location", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [draft, setDraft] = useState(initialDraft);
    const [errors, setErrors] = useState({});

    const duplicateCode = useMemo(() => {
        const c = draft.code.trim().toLowerCase();
        if (!c) return false;
        return depts.items.some((x) => String(x.code || "").toLowerCase() === c);
    }, [draft.code, depts.items]);

    const canSave = useMemo(() => {
        if (!draft.name.trim()) return false;
        if (!draft.code.trim()) return false;
        if (duplicateCode) return false;
        if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) return false;
        if (draft.budget && Number.isNaN(Number(draft.budget))) return false;
        return true;
    }, [draft, duplicateCode]);

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => ({ ...d, [key]: val }));
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Name is required";
        if (!draft.code.trim()) next.code = "Code is required";
        if (duplicateCode) next.code = "Code must be unique";
        if (draft.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = "Invalid email";
        if (draft.budget && Number.isNaN(Number(draft.budget))) next.budget = "Budget must be a number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const id = depts.create({
            name: draft.name.trim(),
            code: draft.code.trim(),
            manager: draft.manager.trim(),
            location: draft.location.trim(),
            email: draft.email.trim(),
            phone: draft.phone.trim(),
            establishedOn: draft.establishedOn,
            budget: draft.budget ? Number(draft.budget) : null,
            isArchived: !!draft.isArchived,
            notes: draft.notes.trim(),
            createdAt: localdb.nowISTLabel(),
        });

        navigate(`/departments/${id}`);
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/departments">Departments</NavLink>
                <span>›</span>
                <span className="current">New</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>New Department</h3>
                    <p className="muted">Create a department and assign a manager. All data stays in your browser.</p>
                </div>
                <div className="right">
                    <NavLink to="/departments" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit} noValidate>
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
                        <label>Code <span className="req">*</span></label>
                        <input
                            value={draft.code}
                            onChange={onChange("code")}
                            placeholder="e.g., ENG"
                            title="Letters, numbers, spaces, underscore and dash"
                            pattern="[A-Za-z0-9 _-]{2,20}"
                        />
                        {errors.code && <div className="err">{errors.code}</div>}
                    </div>

                    <div>
                        <label>Manager</label>
                        <input
                            value={draft.manager}
                            onChange={onChange("manager")}
                            placeholder="Manager name"
                        />
                    </div>

                    <div>
                        <label>Location</label>
                        <input
                            value={draft.location}
                            onChange={onChange("location")}
                            placeholder="City / Floor / Office"
                        />
                    </div>

                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={draft.email}
                            onChange={onChange("email")}
                            placeholder="dept@company.com"
                            autoComplete="email"
                        />
                        {errors.email && <div className="err">{errors.email}</div>}
                    </div>

                    <div>
                        <label>Phone</label>
                        <input
                            value={draft.phone}
                            onChange={onChange("phone")}
                            placeholder="+91 98765 43210"
                            inputMode="tel"
                            autoComplete="tel"
                            pattern="[0-9 +\-]*"
                        />
                    </div>

                    <div>
                        <label>Established On</label>
                        <input
                            type="date"
                            value={draft.establishedOn}
                            onChange={onChange("establishedOn")}
                        />
                    </div>

                    <div>
                        <label>Budget (₹/year)</label>
                        <input
                            value={draft.budget}
                            onChange={onChange("budget")}
                            placeholder="2500000"
                            inputMode="numeric"
                        />
                        {errors.budget && <div className="err">{errors.budget}</div>}
                    </div>

                    <div className="inline">
                        <label className="toggle">
                            <input type="checkbox" checked={draft.isArchived} onChange={onChange("isArchived")} />
                            <span>Archived (hidden from active lists)</span>
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
                    <NavLink to="/departments" className="btn ghost">Cancel</NavLink>
                    <button type="submit" disabled={!canSave}>Save Department</button>
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
                        <div className="value">Departments → List (sorted by Updated)</div>
                    </div>
                </div>
            </Styled.HintCard>
        </Styled.Page>
    );
}
