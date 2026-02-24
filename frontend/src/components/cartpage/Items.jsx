import React, { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import trashIcon from "../../assets/trash.png";
import { deletePendingOrder, getPendingOrders } from "../../api/clientApi";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function resolveImageUrl(path) {
  if (!path) return "/assets/images/placeholder_product.png";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}

export default function Items({ onSummaryChange }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0),
    [items]
  );

  useEffect(() => {
    if (typeof onSummaryChange === "function") {
      onSummaryChange({ count: items.length, totalPrice });
    }
  }, [items.length, onSummaryChange, totalPrice]);

  useEffect(() => {
    let isMounted = true;

    async function loadPendingOrders() {
      try {
        setLoading(true);
        setError("");
        const data = await getPendingOrders();
        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load pending cart items");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadPendingOrders();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDeleteOne = async (orderId) => {
    try {
      setActionLoading(true);
      await deletePendingOrder(orderId);
      setItems((prev) => prev.filter((row) => row.orderId !== orderId));
    } catch (err) {
      setError(err?.message || "Failed to delete cart item");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setActionLoading(true);
      await Promise.all(items.map((row) => deletePendingOrder(row.orderId)));
      setItems([]);
    } catch (err) {
      setError(err?.message || "Failed to clear cart");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="px-6 py-8 text-center font-nexa text-green-dark">Loading cart...</div>;
  }

  if (error) {
    return <div className="px-6 py-8 text-center font-nexa text-red-600">{error}</div>;
  }

  if (!items.length) {
    return <div className="px-6 py-10 text-center font-nexa text-green-dark">Your cart is empty.</div>;
  }

  return (
    <>
      <div className="max-h-[360px] overflow-y-auto px-4 sm:px-6">
        {items.map((item) => (
          <div
            key={item.orderId}
            className="grid grid-cols-12 items-center gap-2 border-b border-green-dark/15 py-4 md:gap-4"
          >
            <div className="col-span-12 flex items-center gap-3 md:col-span-5">
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white-broken">
                <img
                  src={resolveImageUrl(item?.product?.image)}
                  alt={item?.product?.name || "Product"}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="font-nexa text-lg font-bold text-green-dark">{item?.product?.name || "Product name"}</p>
            </div>

            <div className="col-span-6 flex items-center justify-center gap-2 md:col-span-3">
              <button
                type="button"
                disabled
                className="h-7 w-7 rounded bg-gradient-to-r from-green-tolerated to-green-dark text-xs text-white-intense opacity-80"
                aria-label="Decrease quantity"
              >
                {"<"}
              </button>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-medium text-sm font-bold text-white-intense">
                {item?.quantity || 1}
              </span>
              <button
                type="button"
                disabled
                className="h-7 w-7 rounded bg-gradient-to-r from-green-tolerated to-green-dark text-xs text-white-intense opacity-80"
                aria-label="Increase quantity"
              >
                {">"}
              </button>
            </div>

            <p className="col-span-4 text-center font-nexa text-2xl text-green-dark md:col-span-3 md:text-3xl">
              {(Number(item?.product?.price || 0) * Number(item?.quantity || 0)).toFixed(2)} DH
            </p>

            <div className="col-span-2 flex justify-end md:col-span-1">
              <button
                type="button"
                onClick={() => handleDeleteOne(item.orderId)}
                disabled={actionLoading}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-medium hover:bg-green-dark disabled:opacity-60"
                aria-label="Delete item"
              >
                <img src={trashIcon} alt="" className="h-5 w-5 object-contain" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={handleClearCart}
          disabled={actionLoading}
          className="font-nexa text-3xl text-green-dark/80 hover:text-green-dark disabled:opacity-60"
        >
          Clear Cart
        </button>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
          <p className="font-nexa text-2xl font-bold text-green-dark">
            Total Price : <span className="ml-2">{totalPrice.toFixed(2)} DH</span>
          </p>
          <Button className="h-12 w-36 text-3xl" disabled={items.length === 0 || actionLoading}>
            Order
          </Button>
        </div>
      </div>
    </>
  );
}
