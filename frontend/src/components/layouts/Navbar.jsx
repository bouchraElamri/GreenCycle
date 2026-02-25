import { useContext } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import AdminNav from "../navbars/adminnav";
import ClientNav from "../navbars/clientnav";
import SellerNav from "../navbars/sellernav";
import UserNav from "../navbars/usernav";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, role } = useContext(AuthContext);

  const roles = Array.isArray(role) ? role : role ? [role] : [];
  const normalizedRoles = roles.map((r) => String(r).toLowerCase());

  const isAdminUser =
    normalizedRoles.includes("admin") ||
    normalizedRoles.includes("administrator");
  const isSellerUser = normalizedRoles.includes("seller");

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isSellerRoute = location.pathname.startsWith("/seller");
  const isSellerView = isSellerUser && isSellerRoute;

  if (!isAuthenticated) {
    return <UserNav />;
  }

  if (isAdminUser || isAdminRoute) {
    return <AdminNav />;
  }

  if (isSellerView) {
    return <SellerNav />;
  }

  return <ClientNav />;
}
