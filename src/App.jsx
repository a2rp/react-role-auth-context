import ScrollToTop from "./components/ScrollToTop";
import Styled from "./App.styled";
import { NavLink, useLocation } from "react-router-dom";
import { Suspense, useEffect, useRef, useState } from "react";
import { MdArrowUpward, MdMenuOpen } from "react-icons/md";
import { TbSunMoon } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { Box, CircularProgress } from "@mui/material";
import Footer from "./components/footer";
import NavList from "./components/navList";
import AppRoutes from "./routes/AppRoutes";
import Breadcrumbs from "./components/Breadcrumbs";
import { useAuth } from "./context/AuthContext";

const THEME_KEY = "theme";
const getInitialTheme = () => {
    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === "light" || saved === "dark") return saved;
    } catch {
        return "dark";
    }
    if (typeof window !== "undefined" && window.matchMedia) {
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    return "dark";
};

const App = () => {
    const { user, logout } = useAuth();
    const { pathname } = useLocation();
    const [displayNav, setDisplayNav] = useState(true);
    const contentRef = useRef(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const element = contentRef.current;
        if (!element) return undefined;
        const onScroll = () => setShowScrollTop(element.scrollTop > 100);
        onScroll();
        element.addEventListener("scroll", onScroll);
        return () => element.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch {
            return undefined;
        }
        return undefined;
    }, [theme]);

    const scrollToTop = () => contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <Styled.Wrapper>
            <Styled.Header>
                <Styled.LogoLinkWrapper className="role-auth-header">
                    <Styled.NavLinkWrapper
                        as="button"
                        type="button"
                        onClick={() => setDisplayNav((previous) => !previous)}
                        title="Toggle Navigation"
                        aria-label="Toggle navigation"
                        aria-expanded={displayNav}
                    >
                        <MdMenuOpen size={20} />
                    </Styled.NavLinkWrapper>
                    <NavLink to="/" title="React Role Auth Context">
                        <img src={import.meta.env.BASE_URL + "logo.png"} alt="Ashish Ranjan logo" />
                        <span>React Role Auth Context</span>
                    </NavLink>
                </Styled.LogoLinkWrapper>

                <Styled.Heading>
                    <div
                        className="themeToggle"
                        title={"Switch to " + (theme === "light" ? "Dark" : "Light") + " theme"}
                        role="button"
                        tabIndex={0}
                        aria-pressed={theme === "light"}
                        onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                setTheme((current) => (current === "light" ? "dark" : "light"));
                            }
                        }}
                    >
                        <TbSunMoon />
                    </div>

                    {user?.isLoggedIn && (
                        <div className="userBox">
                            <FaRegUser size={16} />
                            <span>
                                {user.name} <em>({user.role})</em>
                            </span>
                            <button type="button" onClick={logout}>
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
                            key={pathname}
                            fallback={
                                <Box sx={{ width: "100%", height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
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