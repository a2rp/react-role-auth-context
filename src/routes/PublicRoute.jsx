import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
    const { user } = useAuth();

    // If already logged in, redirect based on role
    if (user?.isLoggedIn) {
        let redirectPath = "/dashboard"; // default
        if (user.role === "root") redirectPath = "/root";
        else if (user.role === "admin") redirectPath = "/admin";
        else if (user.role === "employee") redirectPath = "/employee";

        return <Navigate to={redirectPath} replace />;
    }

    // Otherwise allow access to public pages
    return <Outlet />;
};

export default PublicRoute;
