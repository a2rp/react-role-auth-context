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
const danger = "var(--danger)";
const warning = "var(--warning)";

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
        .header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 12px;
            padding: 12px 14px;
            background: ${card};
            border: 1px solid ${border};
            border-radius: ${radius};
            box-shadow: ${shadow};
            .title h3 {
                margin: 0 0 4px;
                font-weight: 800;
                letter-spacing: 0.3px;
            }
            .title p {
                margin: 0;
                color: ${muted};
            }
            .stats {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
            }
            .chip {
                background: ${surface};
                border: 1px solid ${border};
                border-radius: 999px;
                padding: 6px 10px;
                font-size: 12px;
                box-shadow: ${shadow};
            }
        }
        @media (max-width: 720px) {
            .header {
                flex-direction: column;
                align-items: stretch;
            }
        }
    `,

    Toolbar: styled.div`
        position: sticky;
        top: 70px;
        z-index: 10;
        background: ${surface};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;

        .left {
            flex: 1;
        }
        .left input {
            width: 100%;
            background: ${card};
            border: 1px solid ${border};
            color: ${text};
            border-radius: 8px;
            padding: 8px 10px;
        }

        .right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
        }
        .toggle {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
        }
        .toggle input {
            accent-color: ${accent};
        }
        button {
            background: ${card};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
        }
        button:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,

    CreateCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 14px;

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
        input[type="color"] {
            padding: 0;
            height: 36px;
        }
        .inline {
            display: flex;
            align-items: center;
            height: 100%;
        }
        .duration .label {
            font-size: 12px;
            color: ${muted};
            margin-right: 8px;
        }
        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 640px) {
            .span2 {
                grid-column: span 1;
            }
        }

        .actions {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 8px;
        }
    `,

    TableWrap: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        overflow: auto;

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        th,
        td {
            padding: 10px 12px;
            border-bottom: 1px solid ${border};
        }
        thead th {
            position: sticky;
            top: 0;
            background: ${surface};
            color: ${accent};
            border-bottom: 1px solid ${border};
            cursor: pointer;
        }
        tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        tbody tr[data-deleted="true"] {
            opacity: 0.8;
            filter: grayscale(0.25);
        }
        .rowLink {
            color: ${text};
            font-weight: 600;
        }
        .rowLink:hover {
            color: ${accent};
        }
        .id {
            font-size: 11px;
            color: ${muted};
            margin-top: 2px;
            word-break: break-all;
        }

        .pill {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            border: 1px solid ${border};
            background: ${surface};
        }
        .pill.ok {
            color: ${accent};
            background: ${accentSoft};
            border-color: transparent;
        }
        .pill.warn {
            color: ${warning};
            background: rgba(217, 119, 6, 0.12);
            border-color: transparent;
        }
        .pill.danger {
            color: ${danger};
            background: rgba(239, 68, 68, 0.12);
            border-color: transparent;
        }

        .colorDot {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 1px solid ${border};
            box-shadow: ${shadow};
            display: inline-block;
            vertical-align: middle;
        }
    `,

    Empty: styled.div`
        padding: 26px 10px;
        text-align: center;
        .hint {
            color: ${muted};
        }
    `,
};

export default Styled;
