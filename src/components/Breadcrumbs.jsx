// /src/components/Breadcrumbs.jsx
import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";

/* map path segments to human labels */
const LABELS = {
    home: "Home",
    about: "About",
    dashboard: "Dashboard",
    search: "Search",

    // Examples
    examples: "Examples",
    table: "Table",
    form: "Form",
    gallery: "Gallery",
    print: "Print",
    "confirm-modal": "Confirm Modal",
    theme: "Theme Demo",
    breadcrumbs: "Breadcrumbs",
    "nav-search": "Nav Search",
    counter: "Counter",
    "persist-theme": "Persist Theme",
    "devtools-todos": "Devtools Todos",
    "subscribe-selector": "Subscribe + Selector",
    "undo-redo": "Undo / Redo",

    // Customers
    customers: "Customers",
    new: "New",
    edit: "Edit",

    // Orders
    orders: "Orders",
    items: "Items",
    invoice: "Invoice",

    // Products / Inventory / Categories
    products: "Products",
    categories: "Categories",
    inventory: "Inventory",

    // Billing
    invoices: "Invoices",
    receipts: "Receipts",

    // Shipments
    shipments: "Shipments",
    track: "Track",
    labels: "Labels",

    // Vendors / POs
    vendors: "Vendors",
    "purchase-orders": "Purchase Orders",

    // Reports
    reports: "Reports",
    sales: "Sales",
    finance: "Finance",

    // Settings
    settings: "Settings",
    profile: "Profile",
    appearance: "Appearance",
    billing: "Billing",
    backups: "Backups",
    tokens: "API Tokens",

    // Tools
    tools: "Tools",
    "import-export": "Import / Export",
    seed: "Seed Data",
    "theme-tokens": "Theme Tokens",
    playground: "Playground",

    // Admin
    admin: "Admin",
    users: "Users",
    roles: "Roles",
    permissions: "Permissions",
    "audit-log": "Audit Log",
    activity: "Activity",
    "system-status": "System Status",
    "feature-flags": "Feature Flags",

    // Auth
    auth: "Auth",
    login: "Login",
    register: "Register",
    forgot: "Forgot Password",
    reset: "Reset Password",
    verify: "Verify Email",

    // Account / Help
    profile_root: "Profile",
    notifications: "Notifications",
    help: "Help Center",
    faq: "FAQ",
    contact: "Contact",
    feedback: "Feedback",
    changelog: "Changelog",
    roadmap: "Roadmap",
};

/* pretty label for dynamic IDs etc. */
const humanize = (s) =>
    decodeURIComponent(s).replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

function segmentLabel(segments, idx) {
    const seg = segments[idx];

    // exact label from map
    if (LABELS[seg]) return LABELS[seg];

    // dynamic id label based on parent
    const prev = segments[idx - 1] || "";
    if (["orders", "customers", "products", "invoices", "shipments", "vendors", "purchase-orders"].includes(prev)) {
        return humanize(seg);
    }

    // default fallback
    return humanize(seg);
}

export default function Breadcrumbs() {
    const { pathname } = useLocation();

    const crumbs = useMemo(() => {
        const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);

        if (parts.length === 0) {
            return [{ to: "/home", label: "Home", isLast: true }];
        }

        const acc = [];
        acc.push({ to: "/home", label: "Home", isLast: false });

        let pathAcc = "";
        parts.forEach((seg, i) => {
            pathAcc += `/${seg}`;
            if (i === 0 && seg === "home") {
                acc[0].isLast = parts.length === 1;
                return;
            }
            const label = segmentLabel(parts, i);
            acc.push({ to: pathAcc, label, isLast: i === parts.length - 1 });
        });

        if (acc.length > 1) acc.forEach((c, i) => (c.isLast = i === acc.length - 1));
        return acc;
    }, [pathname]);

    return (
        <Crumbs aria-label="Breadcrumb">
            <ol>
                {crumbs.map((c, i) => (
                    <li key={c.to}>
                        {c.isLast ? (
                            <span aria-current="page" title={c.label}>{c.label}</span>
                        ) : (
                            <NavLink to={c.to} title={c.label}>{c.label}</NavLink>
                        )}
                        {i < crumbs.length - 1 && <span className="sep">›</span>}
                    </li>
                ))}
            </ol>
        </Crumbs>
    );
}

/* styles (uses your theme tokens, subtle background + shadow) */
const Crumbs = styled.nav`
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--muted, #a0a0a7);

  /* subtle surface using your tokens */
  background: color-mix(in oklab, var(--card, #111318) 94%, transparent);
  border: 1px solid var(--border, #23262d);
  border-radius: var(--radius, 16px);
  box-shadow: var(--shadow, 0 10px 30px rgba(0,0,0,.35));
  padding: 8px 12px;

  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  li {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
  }
  .sep {
    margin: 0 6px;
    color: var(--muted, #a0a0a7);
    opacity: .9;
  }
  a {
    color: var(--muted, #a0a0a7);
    text-decoration: none;
    border-bottom: 1px dotted transparent;
    transition: color .2s ease, border-color .2s ease, background .2s ease;
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 6px;
    border-radius: 6px;
  }
  a:hover {
    color: var(--accent, #5aa9ff);
    border-color: var(--accent, #5aa9ff);
    background: color-mix(in oklab, var(--accent, #5aa9ff) 10%, transparent);
  }
  [aria-current="page"] {
    color: var(--text, #f3f4f6);
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 2px 6px;
    border-radius: 6px;
    background: color-mix(in oklab, var(--accent, #5aa9ff) 8%, transparent);
  }
`;
