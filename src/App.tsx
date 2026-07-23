import { Navigate, Route, Routes } from "react-router-dom";
import { GuestApp } from "@/GuestApp";
import { StaffApp } from "@/apps/staff/StaffApp";
import { ScanQRCodePage } from "@/apps/guest/pages/ScanQRCodePage/ScanQRCodePage";
import { LoginPage } from "@/pages/LoginPage/LoginPage";
import { PublicOnlyRoute } from "@/components/auth/AuthRoutes";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import { FinalizeRegistrationPage } from "./pages/EmailActionPages/FinalizeRegistrationPage";
import { ResetPasswordPage } from "./pages/EmailActionPages/ResetPasswordPage";
import { FinalizeEmailChangePage } from "./pages/EmailActionPages/FinalizeEmailChangePage";
import { ThemeToggle } from "@/ui/ThemeToggle";

function App() {
  return (
    <>
      <ThemeToggle />
      <Routes>
        {/* Гість */}
        <Route path="/table/:tableId/*" element={<GuestApp />} />
        <Route path="/" element={<ScanQRCodePage />} />

        {/* Спільний логін для офіціанта та адміна */}
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Email action links — доступні завжди, навіть якщо залогінений */}
        <Route
          path="/finalize-registration"
          element={<FinalizeRegistrationPage />}
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/confirm-email-change"
          element={<FinalizeEmailChangePage />}
        />

        {/* Захищена зона персоналу */}
        <Route path="/staff/*" element={<StaffApp />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
