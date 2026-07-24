import { useEffect } from "react";

import { useAuth } from "@/modules/auth/useAuth";

export default function AuthInitializer() {
  const { restoreSession } = useAuth();

  useEffect(() => {
    restoreSession();
  }, []);

  return null;
}
