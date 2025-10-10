import styled from "styled-components";

const card = "var(--card)";
const surface = "var(--surface, var(--card))";
const text = "var(--text)";
const muted = "var(--muted)";
const border = "var(--border)";
const radius = "var(--radius)";
const shadow = "var(--shadow)";
const accent = "var(--accent)";
const accentSoft = "var(--accent-soft, rgba(90,169,255,0.15))";
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
        .req {
            color: ${accent};
        }
        .mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
                "Liberation Mono", "Courier New", monospace;
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
            margin-left: 8px;
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

        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 640px) {
            .span2 {
                grid-column: span 1;
            }
        }

        .err {
            margin-top: 6px;
            color: #ff6b6b;
            font-size: 12px;
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

    MetaRow: styled.div`
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(3, 1fr);
        @media (max-width: 900px) {
            grid-template-columns: 1fr;
        }

        > div {
            background: ${card};
            border: 1px solid ${border};
            border-radius: ${radius};
            box-shadow: ${shadow};
            padding: 10px 12px;
        }
        .label {
            font-size: 12px;
            color: ${muted};
        }
        .value {
            margin-top: 4px;
        }

        .pill {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            line-height: 1;
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
    `,

    DangerCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 14px;

        h4 {
            margin: 0 0 6px 0;
        }
        .actions {
            margin-top: 10px;
        }
        .btn {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 700;
        }
        .btn:hover {
            border-color: ${accent};
            color: ${accent};
        }
        .danger {
            border-color: ${danger};
            color: ${danger};
        }
        .danger:hover {
            background: rgba(239, 68, 68, 0.12);
        }
    `,

    Notice: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 16px;
        text-align: center;
        .actions {
            margin-top: 10px;
            display: flex;
            gap: 8px;
            justify-content: center;
        }
        .btn {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
        }
        .btn:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,
};

export default Styled;
