import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";
import { localdb } from "../../../store/localdb";

/* tiny helper: inline confirm */
function ConfirmOverlay({ open, title = "Are you sure?", message, onConfirm, onCancel }) {
    if (!open) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={onCancel}
            style={{
                position: "fixed", inset: 0, background: "rgba(0,0,0,.55)",
                display: "grid", placeItems: "center", zIndex: 9999
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(560px,92vw)", background: "var(--card)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius)", boxShadow: "var(--shadow)", padding: 16
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

const toCode = (s = "") =>
    s.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");

export default function RoleEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const roles = useLocalCollection("roles", {
        searchFields: ["name", "code", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    // pick role record
    const item = useMemo(() => roles.get(id), [roles, id]);

    // not found
    const notFound = !item;

    const [draft, setDraft] = useState(() => ({
        name: item?.name || "",
        code: item?.code || "",
        description: item?.description || "",
        baseSalary: item?.baseSalary ?? "",
        isDisabled: !!item?.isDisabled,
    }));
    const [errors, setErrors] = useState({});
    const [confirm, setConfirm] = useState({ open: false, mode: "delete" });

    // keep in sync if param changes or data refreshes
    useEffect(() => {
        if (!item) return;
        setDraft({
            name: item.name || "",
            code: item.code || "",
            description: item.description || "",
            baseSalary: item.baseSalary ?? "",
            isDisabled: !!item.isDisabled,
        });
    }, [id, item?.name, item?.code, item?.description, item?.baseSalary, item?.isDisabled]);

    // mark recent for quick-nav
    useEffect(() => { if (id) roles.markRecent(id); }, [id]); // eslint-disable-line

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => {
            // auto-code when editing name AND code looks derived or empty
            if (key === "name") {
                const auto = !d.code || d.code === toCode(d.name);
                return { ...d, name: val, code: auto ? toCode(val) : d.code };
            }
            // numeric normalize for baseSalary
            if (key === "baseSalary") return { ...d, baseSalary: val.replace(/[^\d.]/g, "") };
            return { ...d, [key]: val };
        });
    };

    const validate = () => {
        const next = {};
        if (!draft.name.trim()) next.name = "Name is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        roles.update(id, {
            name: draft.name.trim(),
            code: draft.code.trim(),
            description: draft.description.trim(),
            baseSalary: draft.baseSalary === "" ? null : Number(draft.baseSalary),
            isDisabled: !!draft.isDisabled,
            updatedAt: localdb.nowISTLabel(),
        });
        navigate("/roles"); // safe landing
    };

    const requestDelete = () => setConfirm({ open: true, mode: "delete" });
    const requestRestore = () => setConfirm({ open: true, mode: "restore" });

    const performConfirm = () => {
        if (confirm.mode === "delete") roles.remove(id);
        if (confirm.mode === "restore") roles.restore(id);
        setConfirm({ open: false, mode: "delete" });
        navigate("/roles");
    };

    if (notFound) {
        return (
            <Styled.Page>
                <Styled.Breadcrumbs>
                    <NavLink to="/home">Home</NavLink><span>›</span>
                    <NavLink to="/roles">Roles</NavLink><span>›</span>
                    <span className="current">Edit</span>
                </Styled.Breadcrumbs>

                <Styled.NoticeCard>
                    <h3 style={{ marginTop: 0 }}>Role not found</h3>
                    <p className="muted">The requested role doesn’t exist or was removed.</p>
                    <div className="actions">
                        <NavLink to="/roles" className="btn">Back to roles</NavLink>
                        <NavLink to="/roles/new" className="btn">Create new role</NavLink>
                    </div>
                </Styled.NoticeCard>
            </Styled.Page>
        );
    }

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink><span>›</span>
                <NavLink to="/roles">Roles</NavLink><span>›</span>
                <span className="current">Edit</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>Edit Role</h3>
                    <p className="muted">
                        Update role information. Last updated: <strong>{item?.updatedAt}</strong>
                    </p>
                </div>
                <div className="right">
                    <NavLink to="/roles" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit} noValidate>
                <div className="grid">
                    <div>
                        <label>Name <span className="req">*</span></label>
                        <input value={draft.name} onChange={onChange("name")} placeholder="e.g., ENGINEERING MANAGER" required />
                        {errors.name && <div className="err">{errors.name}</div>}
                    </div>

                    <div>
                        <label>Code</label>
                        <input value={draft.code} onChange={onChange("code")} placeholder="ENGINEERING_MANAGER" />
                        <div className="help">Auto-generated from name (editable).</div>
                    </div>

                    <div>
                        <label>Base Salary (₹ / month)</label>
                        <input value={draft.baseSalary} onChange={onChange("baseSalary")} inputMode="numeric" placeholder="80000" />
                    </div>

                    <div className="span2">
                        <label>Description</label>
                        <textarea rows={3} value={draft.description} onChange={onChange("description")} placeholder="Summary of responsibilities, scope, etc." />
                    </div>

                    <div className="inline">
                        <label className="toggle">
                            <input type="checkbox" checked={draft.isDisabled} onChange={onChange("isDisabled")} />
                            <span>Disabled (hide from assignment)</span>
                        </label>
                    </div>
                </div>

                <div className="actions">
                    <NavLink to="/roles" className="btn ghost">Cancel</NavLink>
                    {item?.isDeleted ? (
                        <button type="button" className="btn warn" onClick={requestRestore}>Restore</button>
                    ) : (
                        <button type="button" className="btn danger" onClick={requestDelete}>Delete</button>
                    )}
                    <button type="submit">Save Changes</button>
                </div>
            </Styled.FormCard>

            <Styled.HintCard>
                <div className="row">
                    <div>
                        <div className="label">Role ID</div>
                        <div className="value">{item?.id}</div>
                    </div>
                    <div>
                        <div className="label">Created at</div>
                        <div className="value">{item?.createdAt}</div>
                    </div>
                    <div>
                        <div className="label">Updated at</div>
                        <div className="value">{item?.updatedAt}</div>
                    </div>
                    <div>
                        <div className="label">Status</div>
                        <div className="value">{item?.isDeleted ? "Deleted" : draft.isDisabled ? "Disabled" : "Active"}</div>
                    </div>
                </div>
            </Styled.HintCard>

            <ConfirmOverlay
                open={confirm.open}
                title={confirm.mode === "delete" ? "Delete role?" : "Restore role?"}
                message={
                    confirm.mode === "delete"
                        ? "This is a soft delete. You can restore it later from the roles list by enabling 'Show deleted'."
                        : "The role will be restored to the active list."
                }
                onConfirm={performConfirm}
                onCancel={() => setConfirm({ open: false, mode: "delete" })}
            />
        </Styled.Page>
    );
}
