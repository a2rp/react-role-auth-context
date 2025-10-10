import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Styled } from "./styled";
import { MdClear } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

const STORAGE_KEY = "navSearch";
const COLLAPSE_KEY = "navCollapsed";
const NS_RECENT = "ems:recent";
const NS_DATA = "ems:v1";

/* recent id logic (unchanged) */
function pickRecentId(kind) {
    try {
        const s = sessionStorage.getItem(`${NS_RECENT}:${kind}`);
        if (s) {
            const v = JSON.parse(s);
            if (typeof v === "string") return v;
            if (Array.isArray(v))
                return (typeof v[0] === "string" ? v[0] : v[0]?.id) || null;
            if (v && typeof v === "object") return v.id || null;
        }
    } catch { }
    try {
        const raw = localStorage.getItem(`${NS_DATA}:${kind}`);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length) {
                const item = arr.find((x) => !x?.isDeleted) || arr[0];
                return item?.id || null;
            }
        }
    } catch { }
    return null;
}

const NavListCore = () => {
    const navRef = useRef(null);
    const wrapperRef = useRef(null);
    const searchInputRef = useRef(null);
    const { pathname } = useLocation();
    const { user } = useAuth();

    const [search, setSearch] = useState(() => {
        try {
            return sessionStorage.getItem(STORAGE_KEY) ?? "";
        } catch {
            return "";
        }
    });
    const [collapsed, setCollapsed] = useState(() => {
        try {
            return JSON.parse(sessionStorage.getItem(COLLAPSE_KEY) || "{}");
        } catch {
            return {};
        }
    });

    /* rebuild ids just to preserve your structure */
    const [ids, setIds] = useState({
        emp: null,
        dep: null,
        role: null,
        shift: null,
        leave: null,
        pay: null,
        doc: null,
    });
    useEffect(() => {
        setIds({
            emp: pickRecentId("employees"),
            dep: pickRecentId("departments"),
            role: pickRecentId("roles"),
            shift: pickRecentId("shifts"),
            leave: pickRecentId("leaves"),
            pay: pickRecentId("payroll"),
            doc: pickRecentId("documents"),
        });
    }, [pathname]);

    /* keep active link centered */
    useEffect(() => {
        const el = navRef.current?.querySelector("a.active");
        if (!el) return;
        const id = requestAnimationFrame(() => {
            try {
                el.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
            } catch {
                el.scrollIntoView();
            }
        });
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    /* collapse handling */
    const applySectionCollapse = useCallback((sectionLabel, isCollapsed) => {
        const root = wrapperRef.current;
        if (!root) return;
        const h = root.querySelector(`h3.title[data-sec="${CSS.escape(sectionLabel)}"]`);
        if (!h) return;
        let node = h.nextElementSibling;
        while (node && node.tagName !== "H3") {
            if (node.tagName === "A")
                node.setAttribute("data-collapsed", isCollapsed ? "true" : "false");
            node = node.nextElementSibling;
        }
        h.setAttribute("data-collapsed", isCollapsed ? "true" : "false");
    }, []);

    const applyAllCollapsed = useCallback(() => {
        const root = wrapperRef.current;
        if (!root) return;
        const headers = Array.from(root.querySelectorAll("h3.title[data-sec]"));
        headers.forEach((h) => {
            const key = h.getAttribute("data-sec");
            const isCollapsed = !!collapsed[key];
            applySectionCollapse(key, isCollapsed);
        });
    }, [collapsed, applySectionCollapse]);

    useEffect(() => {
        try {
            sessionStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsed));
        } catch { }
        applyAllCollapsed();
    }, [collapsed, applyAllCollapsed]);

    /* search filter */
    useEffect(() => {
        try {
            sessionStorage.setItem(STORAGE_KEY, search);
        } catch { }
        const root = wrapperRef.current;
        if (!root) return;
        const q = search.trim().toLowerCase();
        const tokens = q.length ? q.split(/\s+/).filter(Boolean) : [];
        const links = Array.from(root.querySelectorAll("a[href]"));

        links.forEach((a) => {
            const label = (a.textContent || "").toLowerCase();
            const title = (a.getAttribute("title") || "").toLowerCase();
            const isMatch =
                tokens.length === 0 ||
                tokens.every((t) => (label + " " + title).includes(t));
            a.setAttribute("data-hidden", isMatch ? "false" : "true");
        });

        const headers = Array.from(root.querySelectorAll("h3.title[data-sec]"));
        if (tokens.length === 0) {
            headers.forEach((h) => h.setAttribute("data-hidden", "false"));
            applyAllCollapsed();
        } else {
            headers.forEach((h) => {
                let hasVisible = false;
                let node = h.nextElementSibling;
                while (node && node.tagName !== "H3") {
                    if (
                        node.tagName === "A" &&
                        node.getAttribute("data-hidden") === "false"
                    ) {
                        hasVisible = true;
                        break;
                    }
                    node = node.nextElementSibling;
                }
                h.setAttribute("data-hidden", hasVisible ? "false" : "true");
                const key = h.getAttribute("data-sec");
                applySectionCollapse(key, hasVisible ? false : !!collapsed[key]);
            });
        }
    }, [search, collapsed, applyAllCollapsed, applySectionCollapse]);

    /* keyboard + focus shortcuts */
    const handleSearchChange = (e) => setSearch(e.target.value);
    const clearSearch = () => setSearch("");
    const toggleSection = (key) =>
        setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
    const onTitleKey = (e, key) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleSection(key);
        }
    };

    useEffect(() => {
        const el = searchInputRef.current;
        if (el) {
            const id = requestAnimationFrame(() => {
                try {
                    el.focus({ preventScroll: true });
                } catch {
                    el.focus();
                }
            });
            return () => cancelAnimationFrame(id);
        }
    }, []);
    useEffect(() => {
        const handler = (e) => {
            const isMac = navigator.platform.toUpperCase().includes("MAC");
            if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    const ariaExpandedFor = (sec) => {
        const root = wrapperRef.current;
        if (root) {
            const h = root.querySelector(`h3.title[data-sec="${CSS.escape(sec)}"]`);
            if (h) return h.getAttribute("data-collapsed") !== "true";
        }
        return !(collapsed[sec] ?? false);
    };

    /* determine accessible links based on role */
    const accessLinks = useMemo(() => {
        if (!user?.isLoggedIn) return [];
        switch (user.role) {
            case "root":
                return [
                    { to: "/root", label: "Root Dashboard" },
                    { to: "/admin", label: "Admin Dashboard" },
                    { to: "/employee", label: "Employee Dashboard" },
                ];
            case "admin":
                return [
                    { to: "/admin", label: "Admin Dashboard" },
                    { to: "/employee", label: "Employee Dashboard" },
                ];
            case "employee":
                return [{ to: "/employee", label: "Employee Dashboard" }];
            default:
                return [];
        }
    }, [user]);

    /* render */
    return (
        <Styled.Nav ref={navRef} aria-label="EMS Navigation">
            {/* search bar */}
            <div className="searchWraper">
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search (Ctrl + K)"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search navigation"
                    aria-controls="navlinksWrapper"
                />
                {search.trim().length > 0 && (
                    <div
                        className="clearIconWrapper"
                        onClick={clearSearch}
                        role="button"
                        aria-label="Clear search"
                        title="Clear"
                    >
                        <MdClear size={20} />
                    </div>
                )}
            </div>

            <div className="navlinksWrapper" id="navlinksWrapper" ref={wrapperRef}>
                {/* Core */}
                <h3
                    className="title"
                    data-sec="Core"
                    role="button"
                    tabIndex={0}
                    data-collapsed={collapsed["Core"] ? "true" : "false"}
                    aria-expanded={ariaExpandedFor("Core")}
                    onClick={() => toggleSection("Core")}
                    onKeyDown={(e) => onTitleKey(e, "Core")}
                >
                    <span className="chev" aria-hidden="true"></span> Core
                </h3>
                <NavLink to="/home" end title="Landing overview">
                    Home
                </NavLink>
                <NavLink to="/about" end title="About this project">
                    About
                </NavLink>

                {/* Role-based access */}
                {user?.isLoggedIn && (
                    <>
                        <h3
                            className="title"
                            data-sec="Access"
                            role="button"
                            tabIndex={0}
                            data-collapsed={collapsed["Access"] ? "true" : "false"}
                            aria-expanded={ariaExpandedFor("Access")}
                            onClick={() => toggleSection("Access")}
                            onKeyDown={(e) => onTitleKey(e, "Access")}
                        >
                            <span className="chev" aria-hidden="true"></span> Access
                        </h3>

                        {accessLinks.map((link) => (
                            <NavLink key={link.to} to={link.to} end title={link.label}>
                                {link.label}
                            </NavLink>
                        ))}
                    </>
                )}

                {/* Auth section for guests */}
                {!user?.isLoggedIn && (
                    <>
                        <h3
                            className="title"
                            data-sec="Auth"
                            role="button"
                            tabIndex={0}
                            data-collapsed={collapsed["Auth"] ? "true" : "false"}
                            aria-expanded={ariaExpandedFor("Auth")}
                            onClick={() => toggleSection("Auth")}
                            onKeyDown={(e) => onTitleKey(e, "Auth")}
                        >
                            <span className="chev" aria-hidden="true"></span> Auth
                        </h3>
                        <NavLink to="/login" end title="Login to system">
                            Login
                        </NavLink>
                    </>
                )}
            </div>

            <style>{`
        [data-hidden="true"] { display: none !important; }
        #navlinksWrapper a[data-collapsed="true"] { display: none !important; }
      `}</style>
        </Styled.Nav>
    );
};

export default NavListCore;
