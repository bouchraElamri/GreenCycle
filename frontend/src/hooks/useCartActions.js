import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import { addToCart as addToCartApi } from "../api/clientApi";

export default function useCartActions() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

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

  return { addProductToCart, adding, error };
}

