import { NavLink, Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AdminLayout() {
  const navClassName = ({ isActive }) =>
    `block w-full rounded-full px-6 py-3 text-lg font-bold shadow-md transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-green-dark to-green-tolerated text-white-intense shadow-inner"
        : "bg-gradient-to-r from-green-light to-white-intense text-green-dark hover:bg-gradient-to-r hover:from-green-dark hover:to-green-tolerated hover:text-white-intense"
    }`;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white-intense font-nexa">
        <main className="mx-6 pb-8 pt-32 lg:mx-10 xl:mx-24 2xl:mx-40">
          <div className="grid grid-cols-1 items-start gap-y-8 sm:grid-cols-[290px_1px_1fr] sm:gap-x-8 ">
            <aside className="space-y-3 sm:pt-1">
              <NavLink to="/admin" end className={navClassName}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/users" className={navClassName}>
                Users
              </NavLink>
              <NavLink to="/admin/products" className={navClassName}>
                Products
              </NavLink>
              <NavLink to="/admin/orders" className={navClassName}>
                Orders
              </NavLink>
            </aside>
            <div className="hidden h-[500px] bg-white-broken sm:block" />
            <Outlet />
          
          </div>
        </main>
      </div>
    </>
  );
}
