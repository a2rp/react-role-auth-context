import{a as i,u as s,j as e,d as r}from"./index-B3jeX_mu.js";const a=r.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text, #e9e9e9);

  h2 { font-weight: 800; margin-bottom: 10px; }
  button {
    margin-top: 20px;
    padding: 10px 16px;
    background: var(--accent, #22c55e);
    border: 0;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    color: #0b0b0b;
    transition: 0.2s;
    &:hover { opacity: 0.85; transform: translateY(-2px); }
  }
`,d=()=>{const n=i(),{user:t,logout:o}=s();return e.jsxs(a,{children:[e.jsx("h2",{children:"Access Denied"}),e.jsxs("p",{children:["Sorry ",t!=null&&t.name?e.jsx("b",{children:t.name}):"guest",", you don’t have permission to access this page."]}),e.jsxs("div",{style:{display:"flex",gap:"10px",marginTop:"20px"},children:[e.jsx("button",{onClick:()=>n(-1),children:"Go Back"}),(t==null?void 0:t.isLoggedIn)&&e.jsx("button",{onClick:o,children:"Logout"})]})]})};export{d as default};
