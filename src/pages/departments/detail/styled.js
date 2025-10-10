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
        code.id {
            background: ${surface};
            border: 1px solid ${border};
            padding: 2px 6px;
            border-radius: 6px;
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
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;

        h3 {
            margin: 0 0 6px 0;
            font-weight: 800;
            letter-spacing: 0.3px;
        }
        .sub {
            display: flex;
            align-items: center;
            gap: 10px;
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
        .pill.danger {
            color: ${danger};
            background: rgba(239, 68, 68, 0.12);
            border-color: transparent;
        }

        .right {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
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
            button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            .ghost {
                opacity: 0.85;
            }
        }
    `,

    MetaCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 14px;
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(3, 1fr);

        .label {
            font-size: 12px;
            color: ${muted};
        }
        .value {
            margin-top: 2px;
            padding: 8px 10px;
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 8px;
            box-shadow: ${shadow};
            min-height: 34px;
            display: flex;
            align-items: center;
        }

        .span2 {
            grid-column: span 2;
        }
        @media (max-width: 980px) {
            grid-template-columns: repeat(2, 1fr);
            .span2 {
                grid-column: span 2;
            }
        }
        @media (max-width: 640px) {
            grid-template-columns: 1fr;
            .span2 {
                grid-column: span 1;
            }
        }
    `,

    SectionCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px;

        .sectionHeader {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 10px;
            h4 {
                margin: 0;
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
        }
    `,

    TableWrap: styled.div`
        border: 1px solid ${border};
        border-radius: ${radius};
        overflow: auto;
        box-shadow: ${shadow};
        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        thead th {
            position: sticky;
            top: 0;
            background: ${surface};
            color: ${accent};
            border-bottom: 1px solid ${border};
        }
        th,
        td {
            padding: 10px 12px;
            border-bottom: 1px solid ${border};
        }
        tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
        }
        .btn.small {
            padding: 6px 10px;
            border-radius: 8px;
            border: 1px solid ${border};
            background: ${surface};
        }
        .btn.small:hover {
            border-color: ${accent};
            color: ${accent};
        }
    `,

    Empty: styled.div`
        padding: 20px 10px;
        text-align: center;
        .hint {
            color: ${muted};
        }
    `,

    NoticeCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 16px;
        display: grid;
        gap: 8px;
        h3 {
            margin: 0;
        }
        .actions {
            margin-top: 6px;
        }
        .btn {
            display: inline-block;
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
    `,
};

export default Styled;
