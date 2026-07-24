import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export default function GuestRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
