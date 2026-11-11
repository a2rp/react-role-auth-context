import { createContext } from "react";

export const defaultUser = {
    name: null,
    role: null,
    isLoggedIn: false,
};

const AuthContext = createContext({
    user: defaultUser,
    login: () => { },
    logout: () => { },
});

export default AuthContext;
