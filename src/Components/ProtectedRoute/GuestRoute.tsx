
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type GuestRouteProps = {
  children: ReactNode;
};

export default function GuestRoute({ children }: GuestRouteProps) {
  if (localStorage.getItem("user Token")) {
    return <Navigate to="/home"  />;
  }

  return <>{children}</>;
}
