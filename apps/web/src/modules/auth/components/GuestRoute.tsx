import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, startupStatus, setupRequired } = useAuthStore();

  if (startupStatus !== "ready") {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (setupRequired) {
    return <Navigate to="/setup" replace />;
  }

  return children;
}
