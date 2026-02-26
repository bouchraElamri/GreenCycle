import React, { memo } from "react";
import TRIcon from "../../assets/TR.png";
import TLIcon from "../../assets/TL.png";

function Quantity({
  quantity,
  setQuantity,
  maxQuantity = 10,
  minQuantity = 0,
  compact = false,
  disabled = false,
}) {
  const safeMax = Number.isFinite(Number(maxQuantity)) ? Number(maxQuantity) : 10;
  const safeMin = Number.isFinite(Number(minQuantity)) ? Number(minQuantity) : 0;
  const numericQuantity = Number(quantity || 0);

  const isDecreaseDisabled = disabled || numericQuantity <= safeMin;
  const isIncreaseDisabled = disabled || numericQuantity >= safeMax;

  const handleDecrease = () => {
    if (isDecreaseDisabled) return;
    setQuantity((prev) => Math.max(Number(prev || 0) - 1, safeMin));
  };

  const handleIncrease = () => {
    if (isIncreaseDisabled) return;
    setQuantity((prev) => Math.min(Number(prev || 0) + 1, safeMax));
  };

  return (
    <div className={`flex items-center ${compact ? "gap-2" : "gap-3"}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isDecreaseDisabled}
        className={`rounded-lg disabled:opacity-60 disabled:cursor-not-allowed ${compact ? "px-2 py-2 text-sm mr-2" : "px-2 py-2 mr-1"}`}
        style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
      >
        <img
          src={TLIcon}
          alt="Decrease quantity"
          className={compact ? "h-2 w-2 object-contain" : "h-4 w-4 object-contain"}
        />
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
        disabled={isIncreaseDisabled}
        className={`rounded-lg disabled:opacity-60 disabled:cursor-not-allowed ${compact ? "px-2 py-2 text-sm ml-2" : "px-2 py-2 ml-1"}`}
        style={{ background: "linear-gradient(to right, #5F9A62, #1E5A2A)" }}
      >
        <img
          src={TRIcon}
          alt="Increase quantity"
          className={compact ? "h-2 w-2 object-contain" : "h-4 w-4 object-contain"}
        />
      </button>
    </div>
  );
}

export default memo(Quantity);
