import React, { memo } from "react";

function Quantity({ quantity, setQuantity, maxQuantity = 10, minQuantity = 0, compact = false }) {
  const safeMax = Number.isFinite(Number(maxQuantity)) ? Number(maxQuantity) : 10;
  const safeMin = Number.isFinite(Number(minQuantity)) ? Number(minQuantity) : 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(Number(prev || 0) - 1, safeMin));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(Number(prev || 0) + 1, safeMax));
  };

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <button
        type="button"
        onClick={handleDecrease}
        className={`text-white-intense rounded ${compact ? "px-2 py-1 text-sm mr-1" : "px-3 py-1 mr-2"}`}
        style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
      >
        -
      </button>

      <p
        className={`bg-green-dark text-white-intense rounded-full flex items-center justify-center ${
          compact ? "w-7 h-7 text-sm" : "w-8 h-8 text-lg"
        }`}
      >
        {quantity}
      </p>

      <button
        type="button"
        onClick={handleIncrease}
        className={`text-white-intense rounded ${compact ? "px-2 py-1 text-sm ml-1" : "px-3 py-1 ml-2"}`}
        style={{ background: "linear-gradient(to right, #5F9A62, #1E5A2A)" }}
      >
        +
      </button>
    </div>
  );
}

export default memo(Quantity);
