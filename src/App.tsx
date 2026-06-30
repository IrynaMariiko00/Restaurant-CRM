import { Navigate, Route, Routes } from "react-router-dom";
import { GuestApp } from "@/GuestApp";
import { StaffApp } from "@/apps/staff/StaffApp";
import { ScanQRCodePage } from "@/apps/guest/pages/ScanQRCodePage/ScanQRCodePage";
import { LoginPage } from "@/apps/staff/pages/LoginPage/LoginPage";
import { PublicOnlyRoute } from "@/components/auth/AuthRoutes";

function App() {
  return (
    <Routes>
      {/* Гість */}
      <Route path="/table/:tableId/*" element={<GuestApp />} />
      <Route path="/" element={<ScanQRCodePage />} />

      {/* Спільний логін для офіціанта та адміна */}
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Захищена зона персоналу */}
      <Route path="/staff/*" element={<StaffApp />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
