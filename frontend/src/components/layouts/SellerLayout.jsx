import { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function SellerLayout() {
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
    <div className="min-h-screen font-nexa bg-gradient-to-br from-green-light/60 via-white-intense to-white-intense text-gray-700">
      <Navbar />

      <div className="pt-28 pb-12">
        <div className="mx-6 md:mx-24">
          <div className="flex items-start gap-6 lg:gap-8">
            <Sidebar
              role={role}
              onLogout={handleLogout}
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />

            <main className="min-w-0 flex-1 pb-16">
              <Outlet />
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
