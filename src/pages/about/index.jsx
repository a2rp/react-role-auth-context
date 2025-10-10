import React from "react";
import { Styled } from "./styled";

const About = () => {
    return (
        <Styled.Page>
            <h2>About This Project</h2>
            <p>
                <strong>React Role Auth Context</strong> is built to show how cleanly authentication and authorization can be handled on the frontend without external libraries or servers.
            </p>
            <p>
                The app uses three custom route wrappers — <code>PublicRoute</code>, <code>PrivateRoute</code>, and <code>RoleRoute</code> — to manage user access dynamically based on role hierarchy:
            </p>

            <ul>
                <li><b>Root</b> → can access Root, Admin, and Employee areas</li>
                <li><b>Admin</b> → can access Admin and Employee areas</li>
                <li><b>Employee</b> → can access Employee area only</li>
            </ul>

            <p>
                Designed as a base template for future <strong>MERN stack dashboards</strong>, this project focuses on simplicity, readability, and modular code architecture.
            </p>
            <p>
                Author: <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Ashish Ranjan</a>
            </p>
        </Styled.Page>
    );
};

export default About;
