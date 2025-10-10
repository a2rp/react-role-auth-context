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

        .right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
            button,
            .linkBtn {
                background: ${surface};
                border: 1px solid ${border};
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 600;
            }
            button:hover,
            .linkBtn:hover {
                border-color: ${accent};
                color: ${accent};
            }
        }
    `,

    WarningBar: styled.div`
        padding: 10px 12px;
        border: 1px dashed ${danger};
        color: ${danger};
        background: rgba(239, 68, 68, 0.08);
        border-radius: ${radius};
    `,

    InfoGrid: styled.div`
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(4, 1fr);
        @media (max-width: 980px) {
            grid-template-columns: repeat(2, 1fr);
        }
        @media (max-width: 640px) {
            grid-template-columns: 1fr;
        }

        .card {
            background: ${card};
            border: 1px solid ${border};
            border-radius: ${radius};
            box-shadow: ${shadow};
            padding: 12px 14px;
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
            .pill.danger {
                color: ${danger};
                background: rgba(239, 68, 68, 0.12);
                border-color: transparent;
            }
        }
    `,

    Section: styled.section`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 12px 14px;

        h4 {
            margin: 0 0 8px 0;
        }

        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .chip {
            background: ${surface};
            border: 1px solid ${border};
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 12px;
            box-shadow: ${shadow};
        }

        .list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: grid;
            gap: 6px;
            a {
                color: ${text};
            }
            a:hover {
                color: ${accent};
            }
        }
    `,

    NoticeCard: styled.div`
        background: ${card};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        padding: 14px;
        .actions {
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
    `,
};

export default Styled;
