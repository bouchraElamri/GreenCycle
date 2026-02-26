import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import Quantity from "../common/Quantity";
import trashIcon from "../../assets/trash.png";
import useCartActions from "../../hooks/useCartActions";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function resolveImageUrl(path) {
  if (!path) return "/assets/images/placeholder_product.png";
  if (path.startsWith("http")) return path;
  return `${API_ORIGIN}${path}`;
}

export default function Items({ onSummaryChange }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const {
    fetchPendingOrders,
    removePendingOrder,
    clearPendingOrders,
    changePendingOrderQuantity,
    cartLoading: loading,
    cartActionLoading: actionLoading,
    updatingOrderId,
    cartError: error,
  } = useCartActions();

  const normalizedItems = useMemo(
    () =>
      items.map((item) => {
        const quantity = Number(item?.quantity || 0);
        const unitPrice = Number(item?.product?.price || 0);
        return {
          ...item,
          quantity,
          lineTotal: unitPrice * quantity,
        };
      }),
    [items]
  );

  const totalPrice = useMemo(
    () => normalizedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [normalizedItems]
  );

  const summary = useMemo(
    () => ({ count: normalizedItems.length, totalPrice }),
    [normalizedItems.length, totalPrice]
  );

  useEffect(() => {
    if (typeof onSummaryChange === "function") {
      onSummaryChange(summary);
    }
  }, [onSummaryChange, summary]);

  useEffect(() => {
    let isMounted = true;

    async function loadPendingOrders() {
      try {
        const data = await fetchPendingOrders();
        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (_err) {
        if (isMounted) {
          setItems([]);
        }
      }
    }

    loadPendingOrders();
    return () => {
      isMounted = false;
    };
  }, [fetchPendingOrders]);

  const handleDeleteOne = useCallback(
    async (orderId) => {
      try {
        await removePendingOrder(orderId);
        setItems((prev) => prev.filter((row) => row.orderId !== orderId));
      } catch (_err) {
        // Error is surfaced by hook state.
      }
    },
    [removePendingOrder]
  );

  const handleClearCart = useCallback(async () => {
    try {
      await clearPendingOrders(normalizedItems.map((row) => row.orderId));
      setItems([]);
    } catch (_err) {
      // Error is surfaced by hook state.
    }
  }, [clearPendingOrders, normalizedItems]);

  const handleQuantityChange = useCallback(
    async (orderId, updater) => {
      if (updatingOrderId) return;

      const targetItem = items.find((row) => row.orderId === orderId);
      if (!targetItem) return;

      const currentQuantity = Number(targetItem.quantity || 0);
      const nextRequestedQuantity =
        typeof updater === "function" ? updater(currentQuantity) : Number(updater);

      const availableQuantity = Number(targetItem?.product?.availableQuantity);
      const safeMax =
        Number.isFinite(availableQuantity) && availableQuantity > 0
          ? availableQuantity
          : currentQuantity;

      const nextQuantity = Math.max(1, Math.min(nextRequestedQuantity, safeMax));
      if (!Number.isFinite(nextQuantity) || nextQuantity === currentQuantity) {
        return;
      }

      try {
        const updatedOrder = await changePendingOrderQuantity(orderId, nextQuantity);
        if (!updatedOrder) return;

        setItems((prev) =>
          prev.map((row) => {
            if (row.orderId !== orderId) return row;

            const updatedAvailableQuantity = Number(updatedOrder?.product?.availableQuantity);

            return {
              ...row,
              quantity: Number(updatedOrder?.quantity || nextQuantity),
              totalPrice: Number(updatedOrder?.totalPrice || row.totalPrice || 0),
              product: {
                ...row.product,
                ...updatedOrder?.product,
                availableQuantity:
                  Number.isFinite(updatedAvailableQuantity) && updatedAvailableQuantity > 0
                    ? updatedAvailableQuantity
                    : row?.product?.availableQuantity,
              },
            };
          })
        );
      } catch (_err) {
        // Error is surfaced by hook state.
      }
    },
    [changePendingOrderQuantity, items, updatingOrderId]
  );

  const handleConfirmOrder = useCallback(() => {
    navigate("/client/purchase");
  }, [navigate]);

  const isBusy = actionLoading || Boolean(updatingOrderId);

  const itemRows = useMemo(
    () =>
      normalizedItems.map((item) => {
        const availableQuantity = Number(item?.product?.availableQuantity);
        const maxQuantity =
          Number.isFinite(availableQuantity) && availableQuantity > 0
            ? availableQuantity
            : Math.max(1, Number(item.quantity || 1));
        const isRowUpdating = updatingOrderId === item.orderId;

        return (
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
              <p className="font-nexa text-base font-bold text-green-dark">{item?.product?.name || "Product name"}</p>
            </div>

            <div className="col-span-6 flex items-center justify-center md:col-span-3">
              <Quantity
                quantity={item.quantity}
                setQuantity={(updater) => handleQuantityChange(item.orderId, updater)}
                maxQuantity={maxQuantity}
                minQuantity={1}
                compact
                disabled={actionLoading || isRowUpdating}
              />
            </div>

            <p className="col-span-4 text-center font-nexa text-lg text-green-dark md:col-span-3 md:text-2xl">
              {item.lineTotal.toFixed(2)} DH
            </p>

            <div className="col-span-2 flex justify-end md:col-span-1">
              <button
                type="button"
                onClick={() => handleDeleteOne(item.orderId)}
                disabled={actionLoading || isRowUpdating}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-medium hover:bg-green-dark disabled:opacity-60"
                aria-label="Delete item"
              >
                <img src={trashIcon} alt="" className="h-5 w-5 object-contain" />
              </button>
            </div>
          </div>
        );
      }),
    [actionLoading, handleDeleteOne, handleQuantityChange, normalizedItems, updatingOrderId]
  );

  if (loading) {
    return <div className="px-6 py-8 text-center font-nexa text-sm text-green-dark">Loading cart...</div>;
  }

  if (error) {
    return <div className="px-6 py-8 text-center font-nexa text-sm text-red-600">{error}</div>;
  }

  if (!items.length) {
    return <div className="px-6 py-10 text-center font-nexa text-sm text-green-dark">Your cart is empty.</div>;
  }

  return (
    <>
      <div className="max-h-[360px] overflow-y-auto px-4 sm:px-6">{itemRows}</div>

      <div className="flex flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <button
          type="button"
          onClick={handleClearCart}
          disabled={isBusy}
          className="font-nexa text-2xl text-green-dark/80 hover:text-green-dark disabled:opacity-60"
        >
          Clear Cart
        </button>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-6">
          <p className="font-nexa text-xl font-bold text-green-dark">
            Total Price : <span className="ml-2">{totalPrice.toFixed(2)} DH</span>
          </p>
          <Button
            className="h-12 w-44 text-xl"
            disabled={normalizedItems.length === 0 || isBusy}
            onClick={handleConfirmOrder}
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </>
  );
}
