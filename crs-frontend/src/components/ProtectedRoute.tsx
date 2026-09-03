import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "ADMIN" | "STUDENT";
}

export default function ProtectedRoute({
                                           children,
                                           requiredRole,
                                       }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();

    // Chưa đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Đã đăng nhập nhưng không đúng quyền
    if (
        requiredRole &&
        user?.role !== requiredRole
    ) {
        return <Navigate to="/courses" replace />;
    }

    return <>{children}</>;
}