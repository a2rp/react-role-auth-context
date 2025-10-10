import styled from "styled-components";

const cardBg = "var(--card, #111)";
const text = "var(--text, #e9e9e9)";
const muted = "var(--muted, #b7b7b7)";
const border = "var(--border, #222)";
const radius = "var(--radius, 16px)";
const shadow = "var(--shadow, 0 8px 24px rgba(0,0,0,0.35))";
const accent = "var(--accent, #22c55e)";

export const Styled = {
    Page: styled.div`
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 24px;
        background: ${cardBg};
        color: ${text};
        border: 1px solid ${border};
        border-radius: ${radius};
        box-shadow: ${shadow};
        line-height: 1.6;
        letter-spacing: 0.3px;
        animation: fadeIn 0.4s ease-in-out;

        h2 {
            font-size: 1.8rem;
            margin-bottom: 16px;
            font-weight: 800;
            color: ${accent};
        }

        p {
            color: ${text};
            margin-bottom: 14px;
            font-size: 15px;
        }

        ul {
            margin: 16px 0 24px 24px;
            li {
                margin-bottom: 8px;
                color: ${muted};
            }
        }

        a {
            color: ${accent};
            font-weight: 600;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }

        code {
            background: rgba(255, 255, 255, 0.08);
            padding: 2px 6px;
            border-radius: 6px;
            font-family: "Courier New", monospace;
            font-size: 14px;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 600px) {
            padding: 24px 16px;
            h2 {
                font-size: 1.5rem;
            }
        }
    `,
};
