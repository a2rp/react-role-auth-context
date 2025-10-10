import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
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

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <Page>
            <h2>Access Denied</h2>
            <p>
                Sorry {user?.name ? <b>{user.name}</b> : "guest"}, you don’t have permission to access this page.
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button onClick={() => navigate(-1)}>Go Back</button>
                {user?.isLoggedIn && <button onClick={logout}>Logout</button>}
            </div>
        </Page>
    );
};

export default Unauthorized;
