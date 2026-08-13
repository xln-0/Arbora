import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/stores/authStore";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}
