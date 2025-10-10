import{d as r,j as e}from"./index-CFECH2Sz.js";const n="var(--card, #111)",o="var(--text, #e9e9e9)",a="var(--muted, #b7b7b7)",s="var(--border, #222)",i="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",t="var(--accent, #22c55e)",c={Page:r.div`
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 24px;
        background: ${n};
        color: ${o};
        border: 1px solid ${s};
        border-radius: ${i};
        box-shadow: ${d};
        line-height: 1.6;
        letter-spacing: 0.3px;
        animation: fadeIn 0.4s ease-in-out;

        h2 {
            font-size: 1.8rem;
            margin-bottom: 16px;
            font-weight: 800;
            color: ${t};
        }

        p {
            color: ${o};
            margin-bottom: 14px;
            font-size: 15px;
        }

        ul {
            margin: 16px 0 24px 24px;
            li {
                margin-bottom: 8px;
                color: ${a};
            }
        }

        a {
            color: ${t};
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
    `},x=()=>e.jsxs(c.Page,{children:[e.jsx("h2",{children:"Welcome to React Role Auth Context"}),e.jsxs("p",{children:["This project demonstrates a ",e.jsx("strong",{children:"frontend-only"})," role-based authentication system using React, Context API, and React Router."]}),e.jsxs("p",{children:["You can explore the app as different roles — ",e.jsx("b",{children:"Root"}),", ",e.jsx("b",{children:"Admin"}),", or ",e.jsx("b",{children:"Employee"})," — and experience how navigation, route protection, and access permissions change automatically."]}),e.jsxs("p",{children:["The system runs entirely in the browser using ",e.jsx("code",{children:"localStorage"}),", making it perfect for demos, prototypes, or portfolio projects."]})]});export{x as default};
