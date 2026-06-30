import { Route, Routes } from "react-router-dom";
import { GuestLayout } from "@/apps/guest/layouts/GuestLayout";
import { WelcomePage } from "@/apps/guest/pages/WelcomePage/WelcomePage";

export const GuestApp = () => {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route index element={<WelcomePage />} />
      </Route>
    </Routes>
  );
};
