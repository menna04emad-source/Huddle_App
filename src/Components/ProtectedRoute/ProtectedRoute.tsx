
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  if (!localStorage.getItem("user Token")) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

