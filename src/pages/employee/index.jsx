import React from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";

const Page = styled.div`
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
`;

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <Page>
            <h2>Employee Dashboard</h2>
            <p>Welcome, <b>{user.name}</b>. You can view and update your assigned tasks.</p>
            <button onClick={logout}>Logout</button>
        </Page>
    );
};

export default EmployeeDashboard;
