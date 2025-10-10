import React, { createContext, useContext, useEffect, useState } from "react";

// Default user structure
const defaultUser = {
    name: null,
    role: null, // "root" | "admin" | "employee" | null
    isLoggedIn: false,
};

// Create context
const AuthContext = createContext({
    user: defaultUser,
    login: () => { },
    logout: () => { },
});

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("authUser");
            return saved ? JSON.parse(saved) : defaultUser;
        } catch {
            return defaultUser;
        }
    });

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem("authUser", JSON.stringify(user));
    }, [user]);

    // Simulated login (for now)
    const login = (role, name = "Guest User") => {
        setUser({
            name,
            role, // "root", "admin", or "employee"
            isLoggedIn: true,
        });
    };

    // Logout and clear storage
    const logout = () => {
        setUser(defaultUser);
        localStorage.removeItem("authUser");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
