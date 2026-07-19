import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, RequireAdmin } from "@/components/auth/AuthRoutes";
import { WelcomePage } from "@/pages/WelcomePage/WelcomePage";
import { EmployeeProfilePage } from "@/apps/staff/pages/EmployeeProfilePage/EmployeeProfilePage";
import { AdminDashboard } from "@/apps/admin/pages/AdminDashboard/AdminDashboard";

export const StaffApp = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<WelcomePage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />

        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
