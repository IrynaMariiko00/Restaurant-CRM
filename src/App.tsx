import { Navigate, Route, Routes } from "react-router-dom";
import { GuestApp } from "@/GuestApp";
import { StaffApp } from "@/apps/staff/StaffApp";
import { ScanQRCodePage } from "@/apps/guest/pages/ScanQRCodePage/ScanQRCodePage";
import { AboutPage } from "@/pages/AboutPage/AboutPage";
import { MenuListPage } from "@/pages/Menu/MenuListPage";
import { MenuItemDetailPage } from "@/pages/Menu/MenuItemDetailPage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { PublicOnlyRoute } from "@/components/auth/AuthRoutes";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { FinalizeRegistrationPage } from "./pages/EmailActionPages/FinalizeRegistrationPage";
import { ResetPasswordPage } from "./pages/EmailActionPages/ResetPasswordPage";
import { FinalizeEmailChangePage } from "./pages/EmailActionPages/FinalizeEmailChangePage";
import { FinalizeEmployeeRegistrationPage } from "./pages/FinalizeEmployeeRegistrationPage/FinalizeEmployeeRegistrationPage";
import { ThemeToggle } from "@/ui/ThemeToggle";

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        <Route path="/table/:tableId/*" element={<GuestApp />} />
        <Route path="/" element={<ScanQRCodePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuListPage />} />
        <Route path="/menu/:id" element={<MenuItemDetailPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/auth/finalize-employee-registration"
            element={<FinalizeEmployeeRegistrationPage />}
          />
        </Route>
        <Route
          path="/finalize-registration"
          element={<FinalizeRegistrationPage />}
        />
        <Route
          path="/auth/finalize-password-reset"
          element={<ResetPasswordPage />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/employees/finalize-email-change"
          element={<FinalizeEmailChangePage />}
        />
        <Route
          path="/confirm-email-change"
          element={<FinalizeEmailChangePage />}
        />

        <Route path="/staff/*" element={<StaffApp />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
