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

            .title {
                h3 {
                    margin: 0 0 4px 0;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                }
                p {
                    margin: 0;
                    color: ${muted};
                }
            }

            .stats {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                .chip {
                    background: ${surface};
                    border: 1px solid ${border};
                    border-radius: 999px;
                    padding: 6px 10px;
                    font-size: 12px;
                    line-height: 1;
                    box-shadow: ${shadow};
                }
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
            input[type="text"] {
                width: 100%;
                background: ${card};
                border: 1px solid ${border};
                color: ${text};
                border-radius: 8px;
                padding: 8px 10px;
            }
        }

        .right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;

            .toggle {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                input {
                    accent-color: ${accent};
                }
                span {
                    color: ${muted};
                }
            }

            button {
                background: ${card};
                border: 1px solid ${border};
                border-radius: 8px;
                padding: 8px 12px;
                font-weight: 600;
                transition: border-color 0.2s, color 0.2s, background 0.2s;
            }
            button:hover {
                border-color: ${accent};
                color: ${accent};
            }
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
            margin-top: 12px;
            button {
                min-width: 110px;
            }
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
            z-index: 1;
            user-select: none;
            cursor: pointer;
        }

        tbody tr:hover {
            background: rgba(255, 255, 255, 0.03);
        }

        tbody tr[data-deleted="true"] {
            opacity: 0.85;
            filter: grayscale(0.25);
        }
        tbody tr[data-deleted="true"] td:first-child .rowLink {
            text-decoration: line-through;
            opacity: 0.9;
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

        td:last-child button + button {
            margin-left: 6px;
        }

        @media print {
            border: 0;
            box-shadow: none;
            border-radius: 0;
            thead th {
                position: static;
            }
            td:last-child,
            th:last-child {
                display: none;
            }
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
