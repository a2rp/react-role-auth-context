import styled from "styled-components";

const Wrapper = styled.div`
    background: var(--card, #111318);
    border: 1px solid var(--border, #23262d);
    border-radius: 12px;
    margin-top: 32px;
    overflow: hidden;
    padding: 12px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    color: var(--text, #f3f4f6);

    @media (width < 900px) {
        padding: 10px 12px;
        gap: 12px;
        align-items: flex-start;
        flex-direction: column;
    }
`;

const Copyright = styled.div`
    color: var(--muted, #a0a0a7);

    a {
        color: var(--muted, #a0a0a7);
        font-weight: 700;
        text-decoration: none;
        border-radius: 6px;
        transition: color 0.2s ease, box-shadow 0.2s ease;

        &:hover,
        &:focus-visible {
            color: var(--accent, #5aa9ff);
            text-decoration: underline;
            box-shadow: 0 0 0 3px var(--accent-soft, rgba(90, 169, 255, 0.15));
            outline: none;
        }
    }
`;

const Groups = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 10px;
`;

const LinkGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    a {
        display: grid;
        place-items: center;
        width: 32px;
        height: 32px;
        color: var(--muted, #a0a0a7);
        border: 1px solid var(--border, #23262d);
        border-radius: 8px;
        transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

        &:hover,
        &:focus-visible {
            color: var(--accent, #5aa9ff);
            border-color: var(--accent, #5aa9ff);
            box-shadow: 0 0 0 3px var(--accent-soft, rgba(90, 169, 255, 0.15));
            outline: none;
        }
    }
`;

export const Styled = { Wrapper, Copyright, Groups, LinkGroup };