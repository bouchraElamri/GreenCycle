import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import AdminLayout from "../components/layouts/AdminLayout";
import AdminDashboard from "../pages/admin/dashboard/AdminDashboard";

const Placeholder = ({ title }) => (
  <div className="rounded-2xl border border-dashed border-green-light p-6 text-gray bg-white-intense">
    {title} page coming soon.
  </div>
);

export default function AdminRoutes() {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roles = user?.role || [];
  if (!Array.isArray(roles) || !roles.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<Placeholder title="Users" />} />
        <Route path="products" element={<Placeholder title="Products" />} />
        <Route path="orders" element={<Placeholder title="Orders" />} />
      </Route>
    </Routes>
  );
}
