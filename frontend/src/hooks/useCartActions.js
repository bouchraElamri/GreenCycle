import { useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import {
  addToCart as addToCartApi,
  deletePendingOrder as deletePendingOrderApi,
  getPendingOrders as getPendingOrdersApi,
  updatePendingOrderQuantity as updatePendingOrderQuantityApi,
} from "../api/clientApi";

export default function useCartActions() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const [cartLoading, setCartLoading] = useState(false);
  const [cartActionLoading, setCartActionLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [cartError, setCartError] = useState("");

  const addProductToCart = async ({ productId, quantity }) => {
    setError("");

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: `${location.pathname}${location.search}` },
      });
      return { redirectedToLogin: true };
    }

    try {
      setAdding(true);
      const result = await addToCartApi({
        product: productId,
        quantity,
      });
      return { redirectedToLogin: false, result };
    } catch (err) {
      const message = err?.message || "Failed to add product to cart";
      setError(message);
      throw err;
    } finally {
      setAdding(false);
    }
  };

  const fetchPendingOrders = useCallback(async () => {
    try {
      setCartLoading(true);
      setCartError("");
      const data = await getPendingOrdersApi();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      setCartError(err?.message || "Failed to load pending cart items");
      throw err;
    } finally {
      setCartLoading(false);
    }
  }, []);

  const removePendingOrder = useCallback(async (orderId) => {
    try {
      setCartActionLoading(true);
      setCartError("");
      await deletePendingOrderApi(orderId);
    } catch (err) {
      setCartError(err?.message || "Failed to delete cart item");
      throw err;
    } finally {
      setCartActionLoading(false);
    }
  }, []);

  const clearPendingOrders = useCallback(async (orderIds) => {
    try {
      setCartActionLoading(true);
      setCartError("");
      await Promise.all((orderIds || []).map((orderId) => deletePendingOrderApi(orderId)));
    } catch (err) {
      setCartError(err?.message || "Failed to clear cart");
      throw err;
    } finally {
      setCartActionLoading(false);
    }
  }, []);

  const changePendingOrderQuantity = useCallback(
    async (orderId, quantity) => {
      if (updatingOrderId) return null;

      try {
        setUpdatingOrderId(orderId);
        setCartError("");
        const updatedOrder = await updatePendingOrderQuantityApi(orderId, quantity);
        return updatedOrder;
      } catch (err) {
        setCartError(err?.message || "Failed to update cart item quantity");
        throw err;
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [updatingOrderId]
  );

  return {
    addProductToCart,
    adding,
    error,
    fetchPendingOrders,
    removePendingOrder,
    clearPendingOrders,
    changePendingOrderQuantity,
    cartLoading,
    cartActionLoading,
    updatingOrderId,
    cartError,
  };
}
