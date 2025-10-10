import{u as o,j as t,d as r}from"./index-CFECH2Sz.js";const a=r.div`
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
`,i=()=>{const{user:e,logout:n}=o();return t.jsxs(a,{children:[t.jsx("h2",{children:"Admin Dashboard"}),t.jsxs("p",{children:["Hello, ",t.jsx("b",{children:e.name}),". You can manage employees and system data."]}),t.jsx("button",{onClick:n,children:"Logout"})]})};export{i as default};
