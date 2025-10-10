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
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
        }
        .btn:hover {
            border-color: ${accent};
            color: ${accent};
        }
        .ghost {
            opacity: 0.85;
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

        &[data-deleted="true"] {
            border-color: ${danger};
            box-shadow: 0 10px 30px rgba(239, 68, 68, 0.15);
        }

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

    WarnCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;

        .msg {
            color: ${text};
        }
        .pill {
            padding: 3px 8px;
            border-radius: 999px;
            font-size: 11px;
        }
        .danger {
            background: rgba(239, 68, 68, 0.12);
            color: ${danger};
        }

        .actions button {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
        }
        .actions button:hover {
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
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 720px) {
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
        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 720px) {
            .span2 {
                grid-column: span 1;
            }
        }

        .err {
            margin-top: 6px;
            color: ${danger};
            font-size: 12px;
        }

        .actions {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-top: 8px;
            .spacer {
                flex: 1;
            }
            button {
                background: ${surface};
                border: 1px solid ${border};
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 600;
            }
            button:hover {
                border-color: ${accent};
                color: ${accent};
            }
            .danger {
                color: ${danger};
                border-color: ${danger};
            }
        }
    `,

    Notice: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 16px;
        display: grid;
        gap: 8px;
        h4 {
            margin: 0;
        }
        .btn {
            width: fit-content;
        }
    `,
};

export default Styled;
