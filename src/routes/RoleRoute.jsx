import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_HIERARCHY = {
    root: ["root", "admin", "employee"],  // root can access all
    admin: ["admin", "employee"],         // admin can access self + employee
    employee: ["employee"],               // employee only self
};

const RoleRoute = ({ allowed = [] }) => {
    const { user } = useAuth();

    // Not logged in → go to login
    if (!user?.isLoggedIn) return <Navigate to="/login" replace />;

    // Determine what roles this user can access
    const allowedForUser = ROLE_HIERARCHY[user.role] || [];

    // Check if any of those roles overlap with allowed
    const isAllowed = allowed.some((r) => allowedForUser.includes(r));

    if (!isAllowed) return <Navigate to="/unauthorized" replace />;

    return <Outlet />;
};

export default RoleRoute;
