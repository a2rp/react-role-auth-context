import styled, { css } from "styled-components";

/* tokens from CSS variables with safe fallbacks */
const bg = "var(--bg, #0d1117)";
const text = "var(--text, #f3f4f6)";
const muted = "var(--muted, #a0a0a7)";
const card = "var(--card, #111318)";
const border = "var(--border, #23262d)";
const accent = "var(--accent, #5aa9ff)";
const accentSoft = "var(--accent-soft, rgba(90,169,255,0.15))";

/* hover-stable scrollbar (same width always) */
const hoverScrollbarStable = css`
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;

    &::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 8px;
        border: 3px solid transparent;
        background-clip: content-box;
    }

    @media (hover: hover) {
        &:hover {
            scrollbar-color: #666 transparent;
        }
        &:hover::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #3a3a3a, #666);
        }
        &::-webkit-scrollbar-thumb:hover {
            background: #808080;
        }
    }

    @media (hover: none) {
        scrollbar-width: thin;
        scrollbar-color: #555 transparent;
        &::-webkit-scrollbar-thumb {
            background: #555;
        }
    }
`;

export const Styled = {
    Nav: styled.div`
        height: 100%;
        font-family: "Poppins", sans-serif;
        color: ${text};

        .home,
        a {
            color: ${muted};
            text-decoration: none;
            display: flex;
            padding: 6px 8px;
            border-left: 2px solid transparent;
            border-radius: 6px;
            transition: color 0.2s ease, border-color 0.2s ease,
                background 0.2s ease;

            &:hover {
                color: ${accent};
                background: rgba(0, 0, 0, 0.08);
                border-left-color: ${accent};
            }
            &.active {
                color: ${accent};
                border-left-color: ${accent};
                background: ${"color-mix(in oklab, " +
                accent +
                " 12%, transparent)"};
                outline: none;
            }

            /* keyboard focus */
            &:focus-visible {
                outline: none;
                box-shadow: 0 0 0 3px ${accentSoft};
            }
        }

        .title {
            margin-top: 15px;
            margin-bottom: 6px;
            color: ${muted};
            font-weight: 600;
            letter-spacing: 0.3px;
            user-select: none;

            /* clickable header + arrow */
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            border-radius: 6px;

            &:hover {
                background: rgba(0, 0, 0, 0.06);
                color: ${text};
            }

            .chev {
                width: 1em;
                display: inline-block;
                text-align: center;
                opacity: 0.85;
                position: relative;
            }
            .chev::before {
                content: "▾"; /* expanded */
                display: inline-block;
                transition: transform 0.2s ease;
            }
            &[data-collapsed="true"] .chev::before {
                content: "▸"; /* collapsed (right arrow) */
            }
        }

        .searchWraper {
            margin-bottom: 15px;
            position: relative;
            height: 40px;

            input {
                width: 100%;
                height: 100%;
                outline: none;
                border: 1px solid ${border};
                padding: 0 50px 0 15px;
                background-color: ${card};
                color: ${text};
                border-radius: 8px;
                transition: border-color 0.25s ease, box-shadow 0.25s ease;

                &::placeholder {
                    color: ${muted};
                }
                &:focus {
                    border-color: ${accent};
                    box-shadow: 0 0 0 3px ${accentSoft};
                }
            }

            .clearIconWrapper {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: ${muted};
                border-left: 1px solid ${border};
                transition: color 0.2s ease, background 0.2s ease;

                &:hover {
                    color: ${accent};
                    background: ${"color-mix(in oklab, " +
                    accent +
                    " 12%, transparent)"};
                }
            }
        }

        .navlinksWrapper {
            border: 1px solid ${border};
            height: calc(100% - 60px);
            overflow: auto;
            overflow-x: hidden;
            padding-left: 8px;
            padding-right: 6px;
            color: ${muted};
            background: ${"color-mix(in oklab, " + card + " 96%, transparent)"};
            border-radius: 10px;

            ${hoverScrollbarStable};

            .title {
                white-space: nowrap;
            }
            a {
                font-family: Verdana, Geneva, Tahoma, sans-serif;
                white-space: nowrap;
                margin-left: 15px;
            }
        }
    `,
};
