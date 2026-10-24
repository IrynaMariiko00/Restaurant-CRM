import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, RequireAdmin } from "@/components/auth/AuthRoutes";
import { StaffShell } from "@/layouts/StaffShell";
import { WelcomePage } from "@/pages/WelcomePage/WelcomePage";
import { EmployeeProfilePage } from "@/apps/staff/pages/EmployeeProfilePage/EmployeeProfilePage";
import { ChangePasswordPage } from "@/pages/ChangePasswordPage/ChangePasswordPage";
import { UsersManagementPage } from "@/apps/admin/pages/UsersManagement/UsersManagementPage";
import { RegisterEmployeePage } from "@/apps/admin/pages/UsersManagement/RegisterEmployeePage";
import { RestaurantSettingsPage } from "@/apps/admin/pages/RestaurantSettings/RestaurantSettingsPage";
import { ScheduleManagementPage } from "@/apps/admin/pages/ScheduleManagement/ScheduleManagementPage";
import { TablesManagementPage } from "@/apps/admin/pages/TablesManagement/TablesManagementPage";
import { CategoriesManagementPage } from "@/apps/admin/pages/MenuManagement/CategoriesManagementPage";
import { MenuItemEditorPage } from "@/apps/admin/pages/MenuManagement/MenuItemEditorPage";
import { MenuListPage } from "@/pages/Menu/MenuListPage";
import { MenuItemDetailPage } from "@/pages/Menu/MenuItemDetailPage";

export const StaffApp = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<StaffShell />}>
          <Route index element={<WelcomePage />} />
          <Route path="profile" element={<EmployeeProfilePage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="menu" element={<MenuListPage />} />

          <Route element={<RequireAdmin />}>
            <Route
              path="menu/categories"
              element={<CategoriesManagementPage />}
            />
            <Route
              path="menu/new"
              element={<MenuItemEditorPage mode="create" />}
            />
            <Route
              path="menu/:id/edit"
              element={<MenuItemEditorPage mode="edit" />}
            />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="users/new" element={<RegisterEmployeePage />} />
            <Route path="tables" element={<TablesManagementPage />} />
            <Route path="restaurant" element={<RestaurantSettingsPage />} />
            <Route path="schedule" element={<ScheduleManagementPage />} />
          </Route>

          <Route path="menu/:id" element={<MenuItemDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
