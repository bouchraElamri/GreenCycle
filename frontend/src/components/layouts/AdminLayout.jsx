import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout, role } = useContext(AuthContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  async function handleLogout() {
    setMobileSidebarOpen(false);
    await logout();
    navigate("/login");
  }

  useEffect(() => {
    const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
    window.addEventListener("toggle-role-sidebar", toggleSidebar);
    return () => window.removeEventListener("toggle-role-sidebar", toggleSidebar);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white-intense font-nexa">
        <main className="mx-4 pb-8 pt-24 sm:mx-6 sm:pt-28 lg:mx-10 xl:mx-24 2xl:mx-40">
          <div className="grid grid-cols-1 items-start gap-y-6 lg:grid-cols-[288px_1px_1fr] lg:gap-x-8">
            <Sidebar
              role={role || "admin"}
              onLogout={handleLogout}
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
            <div className="hidden h-[500px] bg-white-broken lg:block" />
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
