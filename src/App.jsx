import ScrollToTop from './components/ScrollToTop';
import Styled from './App.styled';
import { Route, Routes, NavLink } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { MdArrowUpward, MdMenuOpen } from 'react-icons/md';
import { TbSunMoon } from 'react-icons/tb';
import { FaRegUser } from 'react-icons/fa';
import { Box, CircularProgress } from '@mui/material';
import Footer from './components/footer';
import NavList from './components/navList';
import AppRoutes from './routes/AppRoutes';
import Breadcrumbs from "./components/Breadcrumbs";
import { useAuth } from "./context/AuthContext"; // ✅ new import

// --- Theme handling ---
const THEME_KEY = 'theme';
const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
    } catch { }
    if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return 'dark';
};

const App = () => {
    const { user, logout } = useAuth(); // ✅ access context
    const [displayNav, setDisplayNav] = useState(true);
    const handleDisplayNav = () => setDisplayNav(prev => !prev);

    // ↑ Scroll-to-top state + ref
    const contentRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const el = contentRef.current;
        if (!el) return;
        const onScroll = () => setShowScrollTop(el.scrollTop > 100);
        onScroll();
        el.addEventListener('scroll', onScroll);
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        try { localStorage.setItem(THEME_KEY, theme); } catch { }
    }, [theme]);

    const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
    const scrollToTop = () => contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.LogoLinkWrapper>
                    <Styled.NavLinkWrapper onClick={handleDisplayNav} title="Toggle Navigation">
                        <MdMenuOpen size={20} />
                    </Styled.NavLinkWrapper>
                    <NavLink to="/" title="React Role Auth Context">React Role Auth Context</NavLink>
                </Styled.LogoLinkWrapper>

                <Styled.Heading>
                    {/* theme toggle */}
                    <div
                        className="themeToggle"
                        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
                        role="button"
                        aria-pressed={theme === 'light' ? 'true' : 'false'}
                        onClick={toggleTheme}
                    >
                        <TbSunMoon />
                    </div>

                    {/* ✅ show user info if logged in */}
                    {user?.isLoggedIn && (
                        <div className="userBox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaRegUser size={16} />
                            <span style={{ fontSize: '14px' }}>
                                {user.name} <em style={{ opacity: 0.7 }}>({user.role})</em>
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    background: 'var(--accent, #22c55e)',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    color: '#0b0b0b'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </Styled.Heading>
            </Styled.Header>

            <Styled.Main>
                <Styled.NavWrapper className={displayNav ? "active" : ""}>
                    <div className="navInner">
                        <NavList />
                    </div>
                </Styled.NavWrapper>

                <Styled.ContentWrapper id="scroll-root" data-scroll-root ref={contentRef}>
                    <Styled.RoutesWrapper>
                        <Breadcrumbs />
                        <Suspense
                            fallback={
                                <Box sx={{
                                    width: '100%', height: '200px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <CircularProgress />
                                </Box>
                            }
                        >
                            <AppRoutes />
                        </Suspense>
                    </Styled.RoutesWrapper>

                    <Styled.Footer>
                        <Footer />
                    </Styled.Footer>
                </Styled.ContentWrapper>
            </Styled.Main>

            {showScrollTop && (
                <Styled.ScrollTopBtn onClick={scrollToTop} aria-label="Scroll to top" title="Scroll to top">
                    <MdArrowUpward size={20} />
                </Styled.ScrollTopBtn>
            )}

            <ScrollToTop />
        </Styled.Wrapper>
    );
};

export default App;
