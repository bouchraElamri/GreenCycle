import React, { memo } from "react";

function Quantity({ quantity, setQuantity, maxQuantity = 10, minQuantity = 0 }) {
  const safeMax = Number.isFinite(Number(maxQuantity)) ? Number(maxQuantity) : 10;
  const safeMin = Number.isFinite(Number(minQuantity)) ? Number(minQuantity) : 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(Number(prev || 0) - 1, safeMin));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(Number(prev || 0) + 1, safeMax));
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDecrease}
        className="text-white-intense px-3 py-1 rounded mr-2"
        style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
      >
        -
      </button>

      <p className="text-lg bg-green-dark text-white-intense rounded-full w-8 h-8 flex items-center justify-center">
        {quantity}
      </p>

      <button
        type="button"
        onClick={handleIncrease}
        className="text-white-intense px-3 py-1 rounded ml-2"
        style={{ background: "linear-gradient(to right, #5F9A62, #1E5A2A)" }}
      >
        +
      </button>
    </div>
  );
}

export default memo(Quantity);
