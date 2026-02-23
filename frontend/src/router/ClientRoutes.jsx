import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import ClientLayout from "../components/layouts/ClientLayout";
import ProfileEdit from "../pages/client/profile/ProfileEdit";
import OrderList from "../pages/client/orders/OrderList";

export default function ClientRoutes() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="min-h-screen p-8 font-nexa text-green-dark">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="profile" element={<ProfileEdit />} />
        <Route path="edit-profile" element={<ProfileEdit />} />
      </Route>
      <Route path="*" element={<Navigate to="/client/orders" replace />} />
    </Routes>
  );
}
