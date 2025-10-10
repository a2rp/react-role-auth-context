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
    department: "",
    level: "",
    baseSalary: "",
    effectiveFrom: toYMD(),
    permissions: "",
    notes: "",
    isArchived: false,
};

export default function RoleNew() {
    const navigate = useNavigate();
    const roles = useLocalCollection("roles", {
        searchFields: ["name", "department", "level", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [draft, setDraft] = useState(initialDraft);
    const [errors, setErrors] = useState({});

    const canSave = useMemo(() => {
        if (!draft.name.trim()) return false;
        if (draft.baseSalary && Number.isNaN(Number(draft.baseSalary))) return false;
        return true;
    }, [draft]);

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => ({ ...d, [key]: val }));
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Role name is required";
        if (draft.baseSalary && Number.isNaN(Number(draft.baseSalary))) next.baseSalary = "Base salary must be a number";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const id = roles.create({
            name: draft.name.trim(),
            department: draft.department.trim(),
            level: draft.level.trim(),
            baseSalary: draft.baseSalary ? Number(draft.baseSalary) : null,
            effectiveFrom: draft.effectiveFrom,
            permissions: draft.permissions.trim(), // keep as CSV for now
            notes: draft.notes.trim(),
            isArchived: !!draft.isArchived,
            createdAt: localdb.nowISTLabel(),
        });

        navigate(`/roles/${id}`);
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/roles">Roles</NavLink>
                <span>›</span>
                <span className="current">New</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>New Role</h3>
                    <p className="muted">Define a role with department, level, and optional salary band.</p>
                </div>
                <div className="right">
                    <NavLink to="/roles" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit} noValidate>
                <div className="grid">
                    <div>
                        <label>Name <span className="req">*</span></label>
                        <input
                            value={draft.name}
                            onChange={onChange("name")}
                            placeholder="e.g., Senior Frontend Engineer"
                            autoFocus
                            required
                        />
                        {errors.name && <div className="err">{errors.name}</div>}
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
                        <label>Level</label>
                        <input
                            value={draft.level}
                            onChange={onChange("level")}
                            placeholder="L2 / L3 / Manager"
                        />
                    </div>

                    <div>
                        <label>Base Salary (₹ / month)</label>
                        <input
                            value={draft.baseSalary}
                            onChange={onChange("baseSalary")}
                            placeholder="80000"
                            inputMode="numeric"
                        />
                        {errors.baseSalary && <div className="err">{errors.baseSalary}</div>}
                    </div>

                    <div>
                        <label>Effective From</label>
                        <input
                            type="date"
                            value={draft.effectiveFrom}
                            onChange={onChange("effectiveFrom")}
                        />
                    </div>

                    <div className="span2">
                        <label>Permissions (comma separated)</label>
                        <input
                            value={draft.permissions}
                            onChange={onChange("permissions")}
                            placeholder="employees.read, employees.write"
                        />
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

                    <div className="inline">
                        <label className="toggle">
                            <input type="checkbox" checked={draft.isArchived} onChange={onChange("isArchived")} />
                            <span>Archived (hidden from assign dialogs)</span>
                        </label>
                    </div>
                </div>

                <div className="actions">
                    <NavLink to="/roles" className="btn ghost">Cancel</NavLink>
                    <button type="submit" disabled={!canSave}>Save Role</button>
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
                        <div className="value">Roles → List (sorted by Updated)</div>
                    </div>
                </div>
            </Styled.HintCard>
        </Styled.Page>
    );
}
