import React, { useEffect, useState } from "react";
import AuthContext, { defaultUser } from "./auth-context";

const AUTH_KEY = "authUser";
const VALID_ROLES = new Set(["root", "admin", "employee"]);

function readSavedUser() {
    if (typeof window === "undefined") return defaultUser;

    try {
        const saved = JSON.parse(window.localStorage.getItem(AUTH_KEY) || "null");
        if (
            !saved ||
            saved.isLoggedIn !== true ||
            !VALID_ROLES.has(saved.role) ||
            typeof saved.name !== "string" ||
            !saved.name.trim()
        ) {
            return defaultUser;
        }

        return { name: saved.name.trim(), role: saved.role, isLoggedIn: true };
    } catch {
        return defaultUser;
    }
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readSavedUser);

    useEffect(() => {
        try {
            window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        } catch {
            // Storage can be unavailable in private browsing or restricted contexts.
        }
    }, [user]);

    const login = (role, name = "Guest User") => {
        if (!VALID_ROLES.has(role)) return;

        setUser({
            name: typeof name === "string" && name.trim() ? name.trim() : "Guest User",
            role,
            isLoggedIn: true,
        });
    };

    const logout = () => {
        setUser(defaultUser);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
