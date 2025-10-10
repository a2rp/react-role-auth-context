import React from "react";
import { Styled } from "./styled";

const Home = () => {
    return (
        <Styled.Page>
            <h2>Welcome to React Role Auth Context</h2>
            <p>
                This project demonstrates a <strong>frontend-only</strong> role-based authentication system using React, Context API, and React Router.
            </p>
            <p>
                You can explore the app as different roles — <b>Root</b>, <b>Admin</b>, or <b>Employee</b> — and experience how navigation, route protection, and access permissions change automatically.
            </p>
            <p>
                The system runs entirely in the browser using <code>localStorage</code>, making it perfect for demos, prototypes, or portfolio projects.
            </p>
        </Styled.Page>
    );
};

export default Home;
