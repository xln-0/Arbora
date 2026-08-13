// app/providers.tsx

import AuthInitializer from "@/modules/auth/AuthInitializer";
import TreeInitializer from "@/modules/trees/TreeInitializer";
import I18nInitializer from "@/i18n/I18nInitializer";

import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nInitializer>
      <AuthInitializer>
        <TreeInitializer>{children}</TreeInitializer>
      </AuthInitializer>
    </I18nInitializer>
  );
}
