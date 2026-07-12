import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, RequireAdmin } from "@/components/auth/AuthRoutes";
import { StaffWelcomePage } from "@/apps/staff/pages/StaffWelcomePage/StaffWelcomePage";
import { EmployeeProfilePage } from "@/apps/staff/pages/EmployeeProfilePage/EmployeeProfilePage";
import { AdminDashboard } from "@/apps/admin/pages/AdminDashboard/AdminDashboard";

export const StaffApp = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<StaffWelcomePage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />

        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};
