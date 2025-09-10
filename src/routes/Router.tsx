import App from "@/App";
import DashboardLayout from "@/layout/DashboardLayout";
import HomePage from "@/pages/Home";
import { createBrowserRouter } from "react-router";
import DailyReport from "@/pages/DailyReport/index";
import DataForms from "@/pages/DataForms";
import Allocations from "@/pages/Allocations";
import LoginPage from "@/pages/Login";
import ForgotPasswordPage from "@/pages/ForgotPassword";
import ResetPasswordPage from "@/pages/ResetPassword";
import { ProtectedRoute } from "./ProtectedRoute";
import Users from "@/pages/Users";
import AllocationsManagementPage from "@/pages/AllocationManagement";

const allocationChildren = [];
for (let i = "a".charCodeAt(0); i <= "z".charCodeAt(0); i++) {
  const letter = String.fromCharCode(i);
  allocationChildren.push({
    path: letter,
    element: (
      <ProtectedRoute roles={["ADMIN", "USER"]}>
        <Allocations />
      </ProtectedRoute>
    ),
  });
}

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <div>Error occurred</div>,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  // Dashboard
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute roles={["ADMIN", "USER"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <div>Error occurred</div>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "report",
        element: (
          <ProtectedRoute roles={["ADMIN", "USER"]}>
            <DailyReport />
          </ProtectedRoute>
        ),
      },
      {
        path: "allocations",
        children: allocationChildren,
      },
      // {
      //   path: "allocations",
      //   children: [
      //     {
      //       path: "a",
      //       element: (
      //         <ProtectedRoute roles={["ADMIN", "USER"]}>
      //           <Allocations />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: "b",
      //       element: (
      //         <ProtectedRoute roles={["ADMIN", "USER"]}>
      //           <Allocations />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: "c",
      //       element: (
      //         <ProtectedRoute roles={["ADMIN", "USER"]}>
      //           <Allocations />
      //         </ProtectedRoute>
      //       ),
      //     },
      //     {
      //       path: "d",
      //       element: (
      //         <ProtectedRoute roles={["ADMIN", "USER"]}>
      //           <Allocations />
      //         </ProtectedRoute>
      //       ),
      //     },
      //   ],
      // },
      {
        path: "users",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "create-data-forms",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <DataForms />
          </ProtectedRoute>
        ),
      },
      {
        path: "allocation-management",
        element: (
          <ProtectedRoute roles={["ADMIN"]}>
            <AllocationsManagementPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
