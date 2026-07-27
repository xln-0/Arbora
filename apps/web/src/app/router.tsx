import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import GuestRoute from "@/modules/auth/components/GuestRoute";
import ProtectedRoute from "@/modules/auth/components/ProtectedRoute";
import PeoplePage from "@/pages/PeoplePage";
import SettingsPage from "@/pages/SettingsPage";
import TreeSettingsPage from "@/pages/TreeSettingsPage";

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
    ],
  },
]);
