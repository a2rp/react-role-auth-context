import styled from "styled-components";

/* Theme tokens (fallbacks keep it safe) */
const bg = "var(--bg, #0d1117)";
const text = "var(--text, #f3f4f6)";
const muted = "var(--muted, #a0a0a7)";
const card = "var(--card, #111318)";
const border = "var(--border, #23262d)";
const accent = "var(--accent, #5aa9ff)";
const accentSoft = "var(--accent-soft, rgba(90,169,255,0.15))";

const Wrapper = styled.div`
    /* Visual separation from page content */
    background: ${"color-mix(in oklab, " + card + " 94%, transparent)"};
    @supports not (color-mix(in oklab, red, transparent)) {
        background: ${card};
    }

    border: 1px solid ${border};
    border-radius: 12px;

    /* Layout */
    margin-top: 32px;
    overflow: hidden;
    padding: 12px 16px;

    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    color: ${text};

    /* Subtle lift */
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);

    @media (width < 900px) {
        padding: 10px 12px;
        gap: 10px;
        border-radius: 10px;
    }
`;

const Col = styled.div`
    a {
        color: ${muted};
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 8px;
        transition: color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease,
            transform 0.2s ease;

        img {
            height: 16px;
            display: block;
        }

        &:hover {
            color: ${accent};
            text-decoration: underline;
            box-shadow: 0 0 0 3px ${accentSoft};
            background: color-mix(in oklab, ${accent} 10%, transparent);
            transform: translateY(-1px);
        }

        &.active {
            color: ${accent};
            text-decoration: none;
            box-shadow: 0 0 0 3px ${accentSoft};
            background: color-mix(in oklab, ${accent} 8%, transparent);
        }

        &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px ${accentSoft};
        }
    }
`;

export const Styled = { Wrapper, Col };
