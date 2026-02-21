import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SellerLayout from "../components/layouts/SellerLayout";
import SellerDashboard from "../pages/seller/dashboard/SellerDashboard";
import ProductList from "../pages/seller/products/ProductList";
import ProductAdd from "../pages/seller/products/ProductAdd";
import OrderList from "../pages/seller/orders/OrderList";
import ProfileEdit from "../pages/seller/profile/ProfileEdit";
import SellerOnboardingPage from "../pages/seller/SellerOnboardingPage";
import AuthContext from "../contexts/AuthContext";

export default function SellerRoutes() {
  const { isAuthenticated, role, loading } = useContext(AuthContext);

  const roles = Array.isArray(role) ? role : role ? [role] : [];
  const hasSellerRole = roles.map((r) => String(r).toLowerCase()).includes("seller");

  if (loading) {
    return <div className="min-h-screen p-8 font-nexa text-green-dark">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasSellerRole) {
    return (
      <Routes>
        <Route index element={<SellerOnboardingPage />} />
        <Route path="*" element={<Navigate to="/seller" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<SellerLayout />}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/add" element={<ProductAdd />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="profile" element={<ProfileEdit />} />
      </Route>
      <Route path="*" element={<Navigate to="/seller" replace />} />
    </Routes>
  );
}
