import{d as o,j as e}from"./index-CFECH2Sz.js";const t="var(--card, #111)",r="var(--text, #e9e9e9)",n="var(--muted, #b7b7b7)",s="var(--border, #222)",i="var(--radius, 16px)",d="var(--shadow, 0 8px 24px rgba(0,0,0,0.35))",a="var(--accent, #22c55e)",c={Page:o.div`
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding: 32px 24px;
        background: ${t};
        color: ${r};
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
            color: ${a};
        }

        p {
            color: ${r};
            margin-bottom: 14px;
            font-size: 15px;
        }

        ul {
            margin: 16px 0 24px 24px;
            li {
                margin-bottom: 8px;
                color: ${n};
            }
        }

        a {
            color: ${a};
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
    `},h=()=>e.jsxs(c.Page,{children:[e.jsx("h2",{children:"About This Project"}),e.jsxs("p",{children:[e.jsx("strong",{children:"React Role Auth Context"})," is built to show how cleanly authentication and authorization can be handled on the frontend without external libraries or servers."]}),e.jsxs("p",{children:["The app uses three custom route wrappers — ",e.jsx("code",{children:"PublicRoute"}),", ",e.jsx("code",{children:"PrivateRoute"}),", and ",e.jsx("code",{children:"RoleRoute"})," — to manage user access dynamically based on role hierarchy:"]}),e.jsxs("ul",{children:[e.jsxs("li",{children:[e.jsx("b",{children:"Root"})," → can access Root, Admin, and Employee areas"]}),e.jsxs("li",{children:[e.jsx("b",{children:"Admin"})," → can access Admin and Employee areas"]}),e.jsxs("li",{children:[e.jsx("b",{children:"Employee"})," → can access Employee area only"]})]}),e.jsxs("p",{children:["Designed as a base template for future ",e.jsx("strong",{children:"MERN stack dashboards"}),", this project focuses on simplicity, readability, and modular code architecture."]}),e.jsxs("p",{children:["Author: ",e.jsx("a",{href:"https://www.ashishranjan.net",target:"_blank",rel:"noreferrer",children:"Ashish Ranjan"})]})]});export{h as default};
