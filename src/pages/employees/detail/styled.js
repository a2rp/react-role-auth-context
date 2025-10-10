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
    `,

    Breadcrumbs: styled.nav`
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
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
            margin: 0 0 6px 0;
            font-weight: 800;
            letter-spacing: 0.3px;
        }
        .meta {
            display: flex;
            align-items: center;
            gap: 10px;
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

        .right {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        .btn,
        button {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            padding: 8px 12px;
            font-weight: 600;
        }
        .btn:hover,
        button:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,

    Card: styled.div`
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

        .label {
            font-size: 12px;
            color: ${muted};
        }
        .value {
            margin-top: 2px;
            padding: 8px 10px;
            border-radius: 8px;
            background: ${surface};
            border: 1px solid ${border};
        }

        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 640px) {
            .span2 {
                grid-column: span 1;
            }
        }
    `,

    MetaCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;

        .row {
            display: grid;
            gap: 12px;
            grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 980px) {
            .row {
                grid-template-columns: repeat(2, 1fr);
            }
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
            padding: 8px 10px;
            border-radius: 8px;
            background: ${surface};
            border: 1px solid ${border};
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .value.id code {
            word-break: break-all;
        }
        .mini {
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 12px;
            background: ${card};
            border: 1px solid ${border};
        }
        .mini:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,

    MissingCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 16px;
        h3 {
            margin: 0 0 6px 0;
        }
        .actions {
            display: flex;
            gap: 8px;
            margin-top: 10px;
        }
        .btn {
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
        .muted {
            color: ${muted};
        }
    `,
};

export default Styled;
