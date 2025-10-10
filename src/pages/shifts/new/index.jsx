import React, { useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Styled } from "./styled";
import useLocalCollection from "../../../hooks/useLocalCollection";
import { localdb } from "../../../store/localdb";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const hhmmToMinutes = (hhmm) => {
    if (!hhmm || !/^\d{2}:\d{2}$/.test(hhmm)) return 0;
    const [h, m] = hhmm.split(":").map((n) => Number(n));
    return h * 60 + m;
};
const minutesToLabel = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(h)}:${pad(m)} hrs`;
};

const initialDraft = {
    title: "",
    code: "",
    start: "09:00",
    end: "17:30",
    breakMins: "30",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isActive: true,
    location: "",
    notes: "",
};

export default function ShiftsNew() {
    const navigate = useNavigate();
    const shifts = useLocalCollection("shifts", {
        searchFields: ["title", "code", "location", "id"],
        sortInitial: { by: "updatedAt", dir: "desc" },
    });

    const [draft, setDraft] = useState(initialDraft);
    const [errors, setErrors] = useState({});

    const startMin = hhmmToMinutes(draft.start);
    const endMin = hhmmToMinutes(draft.end);
    const rawSpan = Math.max(0, endMin - startMin);
    const breakMin = draft.breakMins ? Math.max(0, Number(draft.breakMins)) : 0;
    const netMinutes = Math.max(0, rawSpan - (Number.isFinite(breakMin) ? breakMin : 0));
    const durationLabel = minutesToLabel(netMinutes);

    const canSave = useMemo(() => {
        if (!draft.title.trim()) return false;
        if (!(startMin < endMin)) return false;
        if (Number.isNaN(Number(draft.breakMins))) return false;
        if (Number(draft.breakMins) < 0 || Number(draft.breakMins) >= rawSpan) return false;
        return true;
    }, [draft.title, draft.breakMins, startMin, endMin, rawSpan]);

    const onChange = (key) => (e) => {
        const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDraft((d) => ({ ...d, [key]: val }));
    };

    const toggleDay = (day) => {
        setDraft((d) => {
            const has = d.days.includes(day);
            const next = has ? d.days.filter((x) => x !== day) : [...d.days, day];
            return { ...d, days: next.sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b)) };
        });
    };

    const validate = () => {
        const next = {};
        if (!draft.title.trim()) next.title = "Title is required";
        if (!(startMin < endMin)) next.time = "End time must be after start time";
        const bm = Number(draft.breakMins);
        if (Number.isNaN(bm)) next.breakMins = "Break must be a number";
        else if (bm < 0) next.breakMins = "Break cannot be negative";
        else if (bm >= rawSpan) next.breakMins = "Break is longer than shift span";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        const id = shifts.create({
            title: draft.title.trim(),
            code: draft.code.trim(),
            start: draft.start,
            end: draft.end,
            breakMins: Number(draft.breakMins) || 0,
            days: [...draft.days],
            durationMins: netMinutes,
            durationLabel,
            isActive: !!draft.isActive,
            location: draft.location.trim(),
            notes: draft.notes.trim(),
            createdAt: localdb.nowISTLabel(),
        });
        navigate(`/shifts/${id}`);
    };

    return (
        <Styled.Page>
            <Styled.Breadcrumbs aria-label="Breadcrumbs">
                <NavLink to="/home">Home</NavLink>
                <span>›</span>
                <NavLink to="/shifts">Shifts</NavLink>
                <span>›</span>
                <span className="current">New</span>
            </Styled.Breadcrumbs>

            <Styled.Header>
                <div className="left">
                    <h3>New Shift</h3>
                    <p className="muted">Define a reusable work shift template: days, time range, breaks.</p>
                </div>
                <div className="right">
                    <NavLink to="/shifts" className="linkBtn">Back to list</NavLink>
                </div>
            </Styled.Header>

            <Styled.FormCard as="form" onSubmit={onSubmit} noValidate>
                <div className="grid">
                    <div>
                        <label>Title <span className="req">*</span></label>
                        <input
                            value={draft.title}
                            onChange={onChange("title")}
                            placeholder="e.g., Day Shift"
                            autoFocus
                            required
                        />
                        {errors.title && <div className="err">{errors.title}</div>}
                    </div>

                    <div>
                        <label>Code</label>
                        <input
                            value={draft.code}
                            onChange={onChange("code")}
                            placeholder="DS-1"
                        />
                    </div>

                    <div>
                        <label>Location</label>
                        <input
                            value={draft.location}
                            onChange={onChange("location")}
                            placeholder="Mumbai HQ / Remote"
                        />
                    </div>

                    <div>
                        <label>Start time</label>
                        <input type="time" value={draft.start} onChange={onChange("start")} />
                    </div>

                    <div>
                        <label>End time</label>
                        <input type="time" value={draft.end} onChange={onChange("end")} />
                    </div>

                    <div>
                        <label>Break (mins)</label>
                        <input
                            value={draft.breakMins}
                            onChange={onChange("breakMins")}
                            inputMode="numeric"
                            placeholder="30"
                        />
                        {errors.breakMins && <div className="err">{errors.breakMins}</div>}
                    </div>

                    <div className="span2">
                        <label>Days of week</label>
                        <div className="days">
                            {DAYS.map((d) => {
                                const active = draft.days.includes(d);
                                return (
                                    <button
                                        type="button"
                                        key={d}
                                        className={`day ${active ? "active" : ""}`}
                                        onClick={() => toggleDay(d)}
                                        aria-pressed={active}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="inline">
                        <label className="toggle">
                            <input type="checkbox" checked={draft.isActive} onChange={onChange("isActive")} />
                            <span>Active</span>
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

                {errors.time && <div className="err" style={{ marginTop: 6 }}>{errors.time}</div>}

                <div className="summary">
                    <div>
                        <div className="label">Schedule</div>
                        <div className="value">
                            {draft.days.length ? draft.days.join(", ") : "—"} · {draft.start}–{draft.end} · Break {draft.breakMins}m
                        </div>
                    </div>
                    <div>
                        <div className="label">Duration</div>
                        <div className="value">{durationLabel}</div>
                    </div>
                </div>

                <div className="actions">
                    <NavLink to="/shifts" className="btn ghost">Cancel</NavLink>
                    <button type="submit" disabled={!canSave}>Save Shift</button>
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
                        <div className="value">Shifts → List (sorted by Updated)</div>
                    </div>
                </div>
            </Styled.HintCard>
        </Styled.Page>
    );
}
