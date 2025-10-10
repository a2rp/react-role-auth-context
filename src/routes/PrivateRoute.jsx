import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
    const { user } = useAuth();

    if (!user?.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Logged-in users can continue
    return <Outlet />;
};

export default PrivateRoute;
