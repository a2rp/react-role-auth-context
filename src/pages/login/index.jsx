import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";

const Page = styled.div`
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
`;

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        login(role, `${role.toUpperCase()} User`);

        // redirect based on role
        const redirects = {
            root: "/root",
            admin: "/admin",
            employee: "/employee",
        };
        navigate(redirects[role] || "/home", { replace: true });
    };

    return (
        <Page>
            <h2>Role-Based Login</h2>
            <p>Select a role to continue:</p>

            <div className="roles">
                <button onClick={() => handleLogin("root")}>Login as Root</button>
                <button onClick={() => handleLogin("admin")}>Login as Admin</button>
                <button onClick={() => handleLogin("employee")}>Login as Employee</button>
            </div>

            <p style={{ fontSize: "13px", opacity: 0.7 }}>
                This is a front-end only demo. No backend or password required.
            </p>
        </Page>
    );
};

export default Login;
