import React from "react";
import { Styled } from "./styled";

const Home = () => (
    <Styled.Page>
        <h2>Welcome to React Role Auth Context</h2>
        <p>
            Explore simulated sign-in and role-aware routes using React Context and React Router.
        </p>
        <p>
            Choose Root, Admin, or Employee on the login page to see how navigation and client-side route rules change with each role.
        </p>
        <p>
            This demo stores its sign-in state in <code>localStorage</code>. It is not real authentication or a security boundary; production apps must enforce permissions on a trusted server.
        </p>
    </Styled.Page>
);

export default Home;
