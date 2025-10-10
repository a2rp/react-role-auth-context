import styled from "styled-components";

const card = "var(--card)";
const surface = "var(--surface, var(--card))";
const text = "var(--text)";
const muted = "var(--muted)";
const border = "var(--border)";
const radius = "var(--radius)";
const shadow = "var(--shadow)";
const accent = "var(--accent)";
const accentSoft = "var(--accent-soft, rgba(47,116,255,0.12))";

export const Styled = {
    Page: styled.div`
        width: 100%;
        max-width: var(--maxw, 1440px);
        margin: 0 auto;
        padding: 12px 16px 40px;
        color: ${text};
        display: grid;
        gap: 12px;
        .muted {
            color: ${muted};
        }
        .req {
            color: ${accent};
        }
    `,

    Breadcrumbs: styled.nav`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        opacity: 0.9;
        a {
            color: ${text};
        }
        a:hover {
            color: ${accent};
        }
        .current {
            color: ${muted};
        }
    `,

    Header: styled.div`
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 12px;
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;

        h3 {
            margin: 0 0 4px 0;
            font-weight: 800;
            letter-spacing: 0.3px;
        }

        .linkBtn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 8px;
            background: ${surface};
            border: 1px solid ${border};
        }
        .linkBtn:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,

    FormCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 14px;
        display: grid;
        gap: 12px;

        .grid {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 980px) {
            .grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        @media (max-width: 640px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }

        label {
            display: block;
            font-size: 12px;
            color: ${muted};
            margin-bottom: 6px;
        }
        input,
        textarea {
            width: 100%;
            background: ${surface};
            border: 1px solid ${border};
            color: ${text};
            border-radius: 8px;
            padding: 8px 10px;
        }
        input[type="time"] {
            padding: 6px 8px;
        }

        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 640px) {
            .span2 {
                grid-column: span 1;
            }
        }

        .inline {
            display: flex;
            align-items: center;
            height: 100%;
        }
        .toggle {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .days {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .day {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 12px;
            line-height: 1;
            cursor: pointer;
        }
        .day.active {
            color: ${accent};
            background: ${accentSoft};
            border-color: transparent;
        }

        .err {
            margin-top: 6px;
            color: #ff6b6b;
            font-size: 12px;
        }

        .summary {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(2, 1fr);
            background: ${surface};
            border: 1px solid ${border};
            border-radius: ${radius};
            padding: 10px;
        }
        @media (max-width: 640px) {
            .summary {
                grid-template-columns: 1fr;
            }
        }
        .label {
            font-size: 12px;
            color: ${muted};
        }
        .value {
            margin-top: 2px;
            padding: 6px 10px;
            background: ${card};
            border: 1px solid ${border};
            border-radius: 8px;
            box-shadow: ${shadow};
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
            button,
            .btn {
                background: ${surface};
                border: 1px solid ${border};
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 600;
            }
            button:hover,
            .btn:hover {
                border-color: ${accent};
                color: ${accent};
            }
            .ghost {
                opacity: 0.85;
            }
            button[disabled] {
                opacity: 0.5;
                cursor: not-allowed;
            }
        }
    `,

    HintCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;

        .row {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 640px) {
            .row {
                grid-template-columns: 1fr;
            }
        }

        .label {
            font-size: 12px;
            color: ${muted};
        }
        .value {
            margin-top: 2px;
            padding: 6px 10px;
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            box-shadow: ${shadow};
        }
    `,
};

export default Styled;
