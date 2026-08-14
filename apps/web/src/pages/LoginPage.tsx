import { Leaf } from "lucide-react";

import { t } from "@/i18n";
import AuthPageShell from "@/modules/auth/components/AuthPageShell";
import LoginForm from "@/modules/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageShell
      eyebrow={
        <>
          <Leaf size={14} />
          {t("auth.welcomeBack")}
        </>
      }
      title={t("auth.heroTitle")}
      description={t("auth.heroDescription")}
      footer={t("auth.privateAccess")}
    >
      <LoginForm />
    </AuthPageShell>
  );
}
