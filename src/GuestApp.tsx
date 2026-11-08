import { Route, Routes } from "react-router-dom";
import { GuestLayout } from "@/apps/guest/layouts/GuestLayout";
import { WelcomePage } from "@/apps/guest/pages/WelcomePage/WelcomePage";
import { GuestOrderPage } from "@/apps/guest/pages/OrderPage/GuestOrderPage";
import { MenuListPage } from "@/pages/Menu/MenuListPage";
import { MenuItemDetailPage } from "@/pages/Menu/MenuItemDetailPage";

export const GuestApp = () => {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route index element={<WelcomePage />} />
        <Route path="menu" element={<MenuListPage />} />
        <Route path="menu/:id" element={<MenuItemDetailPage />} />
        <Route path="order" element={<GuestOrderPage />} />
      </Route>
    </Routes>
  );
};
