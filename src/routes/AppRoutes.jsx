import React, { lazy, Suspense } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RoleRoute from "./RoleRoute";

/* =========================================================
   Pages (lazy imports)
   ========================================================= */
const Home = lazy(() => import("../pages/home"));
const About = lazy(() => import("../pages/about"));
const Login = lazy(() => import("../pages/login"));
const RootDashboard = lazy(() => import("../pages/root"));
const AdminDashboard = lazy(() => import("../pages/admin"));
const EmployeeDashboard = lazy(() => import("../pages/employee"));
const Unauthorized = lazy(() => import("../pages/unauthorized"));
const NotFound = lazy(() => import("../pages/notFound"));

/* =========================================================
   App Routes
   ========================================================= */
const AppRoutes = () => {
    return (
        <Suspense
            fallback={
                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <CircularProgress />
                </Box>
            }
        >
            <Routes>
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/home" replace />} />

                {/* ✅ Public routes (accessible by everyone) */}
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* ✅ Public-only routes (hidden when logged in) */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                {/* ✅ Private (any logged-in user) */}
                <Route element={<PrivateRoute />}>
                    {/* Role-based routes */}
                    <Route element={<RoleRoute allowed={["root"]} />}>
                        <Route path="/root" element={<RootDashboard />} />
                    </Route>

                    <Route element={<RoleRoute allowed={["admin"]} />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<RoleRoute allowed={["employee"]} />}>
                        <Route path="/employee" element={<EmployeeDashboard />} />
                    </Route>
                </Route>

                {/* ✅ Common routes */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
