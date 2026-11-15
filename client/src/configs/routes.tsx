import AuthLayout from "@layouts/auth/auth-layout";
import { DashboardLayout } from "@layouts/dashboard/dashboard-layout";
import RootLayout from "@layouts/root/root-layout";
import { ActivityCreatePage } from "@pages/activities/create-page";
import { ActivityChangeStatusPage } from "@pages/activities/change-status-page";
import { EntityList } from "@pages/entities/list-page";
import { ActivityList, Dashboard, Error404, Login } from "@pages/index";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            index: true,
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "entities",
            element: <EntityList />,
          },
          {
            path: "activities",
            element: <ActivityList />,
          },
          {
            path: "activities/create",
            element: <ActivityCreatePage />,
          },
          {
            path: "activities/:activityId/change-status",
            element: <ActivityChangeStatusPage />,
          },
        ],
      },
      {
        path: "auth",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            path: "login",
            element: <Login />,
          },
        ],
      },
    ],
  },
  {
    path: "/*",
    element: <Error404 />,
  },
]);
