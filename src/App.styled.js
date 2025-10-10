import styled, { css } from "styled-components";

/* ---- Design tokens via CSS vars ---- */
const bg = "var(--bg, #0d1117)";
const text = "var(--text, #f3f4f6)";
const muted = "var(--muted, #a0a0a7)";
const card = "var(--card, #111318)";
const border = "var(--border, #23262d)";
const accent = "var(--accent, #5aa9ff)";
const accentSoft = "var(--accent-soft, rgba(90,169,255,0.15))";
const shadow = "var(--shadow, 0 10px 30px rgba(0,0,0,0.35))";

/* ---- Hover scrollbar with NO layout shift ---- */
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

const Wrapper = styled.div`
    position: relative;
    background: ${bg};
    color: ${text};
    height: 100vh;
    overflow: hidden;
`;

const Header = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: ${bg};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    padding: 15px;
    border-bottom: 1px solid ${border};
    z-index: 1000;
`;

const LogoLinkWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;

    a {
        border-bottom: 1px solid transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 2px 5px;
        color: ${muted};
        text-decoration: none;

        &:hover {
            border-bottom: 1px solid ${muted};
        }
    }
`;

const NavLinkWrapper = styled.div`
    box-shadow: 0 0 1px 1px ${border} inset;
    border-radius: 6px;
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        box-shadow: 0 0 0 2px ${accentSoft} inset;
    }
`;

const Heading = styled.h1`
    font-size: 14px;
    display: flex;
    gap: 15px;
    align-items: center;

    .themeToggle,
    .notifications,
    .settings,
    .user {
        font-size: 20px;
        cursor: pointer;
        color: ${muted};
        display: grid;
        place-items: center;
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid ${border};
        transition: 0.2s ease;
    }
    .themeToggle:hover,
    .notifications:hover,
    .settings:hover,
    .user:hover {
        color: ${accent};
        border-color: ${accent};
        box-shadow: 0 0 0 3px ${accentSoft};
    }
`;

const Main = styled.div`
    height: 100vh;
    padding-top: 70px;
    display: flex;
    align-items: stretch;
    overflow: hidden;
`;

const NavWrapper = styled.div`
    box-shadow: 0 0 1px 1px ${border} inset;
    width: 0;
    flex: 0 0 0;
    transition: 0.2s ease;
    transition-property: width, flex;
    overflow: hidden;
    z-index: 999;
    background-color: ${card};
    position: relative;

    &.active {
        flex: 0 0 250px;
        width: 250px;
    }

    @media (width < 1000px) {
        position: fixed;
        top: 70px;
        left: 0;
        height: calc(100vh - 70px);
    }

    .navInner {
        width: 250px;
        height: 100%;
        overflow-y: auto;
        ${hoverScrollbarStable};
        padding: 15px;
    }
`;

const Tuts = styled.div``;

const ContentWrapper = styled.div`
    box-shadow: 0 0 1px 1px ${border} inset;
    width: 100%;
    overflow: auto;
    padding: 15px 15px 50px 15px;
    scroll-behavior: smooth !important;
    ${hoverScrollbarStable};
    background: ${bg};
`;

const RoutesWrapper = styled.div`
    min-height: 100vh;
`;

const Footer = styled.div`
    padding: 15px;
    color: ${muted};
    border-top: 1px solid ${border};
`;

const ScrollTopBtn = styled.button`
    position: fixed;
    right: 24px;
    bottom: 24px;
    width: 42px;
    height: 42px;
    border-radius: 999px;
    border: 1px solid ${border};
    background: ${card};
    color: ${text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: ${shadow};
    transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
    z-index: 1200;

    &:hover {
        transform: translateY(-2px);
        background: ${bg};
    }
    &:active {
        transform: translateY(0);
    }

    @media (width < 480px) {
        right: 16px;
        bottom: 16px;
        width: 40px;
        height: 40px;
    }
`;

const Styled = {
    Wrapper,
    Header,
    LogoLinkWrapper,
    NavLinkWrapper,
    Heading,
    Main,
    ContentWrapper,
    RoutesWrapper,
    NavWrapper,
    Tuts,
    Footer,
    ScrollTopBtn,
};

export default Styled;
