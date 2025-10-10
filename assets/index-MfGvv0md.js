import{u as i,a as s,j as e,d as a}from"./index-CFECH2Sz.js";const c=a.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
  color: var(--text, #e9e9e9);
  gap: 24px;

  h2 {
    font-weight: 800;
    margin-bottom: 10px;
  }

  .roles {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;

    button {
      padding: 10px 18px;
      border: 0;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      background: var(--accent, #22c55e);
      color: #0b0b0b;
      transition: 0.2s ease;

      &:hover {
        opacity: 0.85;
        transform: translateY(-2px);
      }
    }
  }
`,p=()=>{const{login:n}=i(),r=s(),o=t=>{n(t,`${t.toUpperCase()} User`),r({root:"/root",admin:"/admin",employee:"/employee"}[t]||"/home",{replace:!0})};return e.jsxs(c,{children:[e.jsx("h2",{children:"Role-Based Login"}),e.jsx("p",{children:"Select a role to continue:"}),e.jsxs("div",{className:"roles",children:[e.jsx("button",{onClick:()=>o("root"),children:"Login as Root"}),e.jsx("button",{onClick:()=>o("admin"),children:"Login as Admin"}),e.jsx("button",{onClick:()=>o("employee"),children:"Login as Employee"})]}),e.jsx("p",{style:{fontSize:"13px",opacity:.7},children:"This is a front-end only demo. No backend or password required."})]})};export{p as default};
