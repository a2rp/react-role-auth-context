import React from "react";
import { Styled } from "./styled";

const About = () => (
    <Styled.Page>
        <h2>About This Project</h2>
        <p>
            <strong>React Role Auth Context</strong> is an interactive frontend demo of simulated sign-in, role-aware navigation, and protected routes using React Context and React Router.
        </p>
        <p>
            Three route wrappers demonstrate access rules by role:
        </p>
        <ul>
            <li><b>Root</b> can access Root, Admin, and Employee areas.</li>
            <li><b>Admin</b> can access Admin and Employee areas.</li>
            <li><b>Employee</b> can access the Employee area only.</li>
        </ul>
        <p>
            Sign-in is simulated in the browser and stored in localStorage. Users can change browser storage, so these route checks are for learning and demos only; they do not provide real authentication or security. Production apps must verify identity and permissions on a trusted server.
        </p>
        <p>
            Author: <a href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">Ashish Ranjan</a>
        </p>
    </Styled.Page>
);

export default About;
