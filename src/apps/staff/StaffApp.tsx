import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, RequireAdmin } from "@/components/auth/AuthRoutes";
import { WelcomePage } from "@/pages/WelcomePage/WelcomePage";
import { EmployeeProfilePage } from "@/apps/staff/pages/EmployeeProfilePage/EmployeeProfilePage";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage/ChangePasswordPage";
import { UsersManagementPage } from "@/apps/admin/pages/UsersManagement/UsersManagementPage";
import { RegisterEmployeePage } from "@/apps/admin/pages/UsersManagement/RegisterEmployeePage";
import { MenuManagementPage } from "@/apps/admin/pages/MenuManagement/MenuManagementPage";
import { RestaurantSettingsPage } from "@/apps/admin/pages/RestaurantSettings/RestaurantSettingsPage";
import { ScheduleManagementPage } from "@/apps/admin/pages/ScheduleManagement/ScheduleManagementPage";

export const StaffApp = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route index element={<WelcomePage />} />
        <Route path="profile" element={<EmployeeProfilePage />} />
        <Route path="change-password" element={<ChangePasswordPage />} />

        <Route element={<RequireAdmin />}>
          <Route path="users" element={<UsersManagementPage />} />
          <Route path="users/new" element={<RegisterEmployeePage />} />
          <Route path="menu" element={<MenuManagementPage />} />
          <Route path="restaurant" element={<RestaurantSettingsPage />} />
          <Route path="schedule" element={<ScheduleManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
