import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";

import App from "./App";

import {
  AdminRoute,
  GuestRoute,
  ProtectedRoute,
  SetupRoute,
} from "@/modules/auth/components";
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const PeoplePage = lazy(() => import("@/pages/PeoplePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const TreeSettingsPage = lazy(() => import("@/pages/TreeSettingsPage"));
const AccountPage = lazy(() => import("@/pages/AccountPage"));
const TreeElementsPage = lazy(() => import("@/pages/TreeElementsPage"));
const TreeTimelinePage = lazy(() => import("@/pages/TreeTimelinePage"));
const PersonDetailsPage = lazy(() => import("@/pages/PersonDetailsPage"));
const SetupPage = lazy(() => import("@/pages/SetupPage"));
const AdministrationPage = lazy(() => import("@/pages/AdministrationPage"));

function lazyPage(page: ReactNode) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-screen items-center justify-center bg-background"
          role="status"
          aria-label="Chargement de la page"
        >
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      }
    >
      {page}
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <App />,

    children: [
      {
        path: "/setup",
        element: (
          <SetupRoute>
            {lazyPage(<SetupPage />)}
          </SetupRoute>
        ),
      },

      {
        path: "/login",
        element: (
          <GuestRoute>
            {lazyPage(<LoginPage />)}
          </GuestRoute>
        ),
      },

      {
        path: "/",
        element: (
          <ProtectedRoute>
            {lazyPage(<DashboardPage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/timeline",
        element: (
          <ProtectedRoute>
            {lazyPage(<TreeTimelinePage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/elements",
        element: (
          <ProtectedRoute>
            {lazyPage(<TreeElementsPage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/people/:personId",
        element: (
          <ProtectedRoute>
            {lazyPage(<PersonDetailsPage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/people",
        element: (
          <ProtectedRoute>
            {lazyPage(<PeoplePage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            {lazyPage(<SettingsPage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/tree-settings",
        element: (
          <ProtectedRoute>
            {lazyPage(<TreeSettingsPage />)}
          </ProtectedRoute>
        ),
      },

      {
        path: "/administration",
        element: (
          <ProtectedRoute>
            <AdminRoute>
              {lazyPage(<AdministrationPage />)}
            </AdminRoute>
          </ProtectedRoute>
        ),
      },

      {
        path: "/account",
        element: (
          <ProtectedRoute>
            {lazyPage(<AccountPage />)}
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
