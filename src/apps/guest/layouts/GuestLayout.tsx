import { Outlet } from "react-router-dom";

export const GuestLayout = () => {
  return (
    <div className="guest-layout-wrapper">
      <Outlet />
    </div>
  );
};
