import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import { GuestRoute, ProtectedRoute } from "@/modules/auth/components";
import {
  LoginPage,
  DashboardPage,
  PeoplePage,
  SettingsPage,
  TreeSettingsPage,
  AccountPage,
} from "@/pages";

export const router = createBrowserRouter([
  {
    element: <App />,

    children: [
      {
        path: "/login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        ),
      },

      {
        path: "/",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/people",
        element: (
          <ProtectedRoute>
            <PeoplePage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/tree-settings",
        element: (
          <ProtectedRoute>
            <TreeSettingsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
