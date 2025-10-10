import{u as r,j as t,d as n}from"./index-B3jeX_mu.js";const s=n.div`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text, #e9e9e9);

  h2 {
    font-weight: 800;
    margin-bottom: 10px;
  }

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
`,i=()=>{const{user:o,logout:e}=r();return t.jsxs(s,{children:[t.jsx("h2",{children:"Root Dashboard"}),t.jsxs("p",{children:["Welcome, ",t.jsx("b",{children:o.name})," — you have full system control."]}),t.jsx("button",{onClick:e,children:"Logout"})]})};export{i as default};
