import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export default function SetupRoute({ children }: { children: React.ReactNode }) {
  const { startupStatus, setupRequired, user } = useAuthStore();

  if (startupStatus !== "ready") {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  if (!setupRequired) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
