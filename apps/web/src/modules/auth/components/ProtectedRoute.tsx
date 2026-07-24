import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return null; // ou loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
