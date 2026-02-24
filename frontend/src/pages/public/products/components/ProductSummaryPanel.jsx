import React, { memo } from "react";
import Button from "../../../../components/ui/Button";
import RatingStars from "../../../../components/common/RatingStars";
import Quantity from "../../../../components/common/Quantity";

function ProductSummaryPanel({
  seller,
  product,
  quantity,
  setQuantity,
  adding,
  onAddToCart,
  onSellerClick,
  resolveSellerImageUrl,
}) {
  return (
    <div className="w-full md:w-1/2">
      <div className="flex">
        <div className="w-16 h-16 mt-4 md:mt-0 rounded-full bg-gray-200 overflow-hidden flex md:items-center md:justify-center">
          <img
            src={resolveSellerImageUrl(
              seller?.profileUrl || seller?.user?.profileImage || seller?.user?.profileUrl
            )}
            alt={seller?.fullName}
            className="w-full h-full object-cover rounded-full cursor-pointer"
            onClick={onSellerClick}
          />
        </div>
        <div className="ml-4 flex flex-row justify-center">
          <div className="flex flex-col justify-center">
            <p className="text-lg font-semibold">{seller?.fullName}</p>
            <p className="text-gray-500 text-sm">{seller?.email}</p>
          </div>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-nexa font-bold mt-4 mb-4">{product?.name}</h1>
        <div className="bg-green-light text-gray-900 px-2 py-2 rounded-full w-24 text-center mb-2">
          {product?.category?.name}
        </div>
        <p className="text-gray-700 mb-2 font-nexa">Quantity: {product?.quantity}</p>
        <p className="text-xl font-bold font-nexa mb-3">{product?.price} MAD</p>
        <div className="flex items-center gap-2 mb-4">
          <RatingStars product={product} />
        </div>
        <div className="flex gap-14 md:gap-6">
          <Quantity
            quantity={quantity}
            setQuantity={setQuantity}
            maxQuantity={product?.quantity || 10}
            minQuantity={0}
          />
          <Button
            onClick={onAddToCart}
            disabled={adding}
            className="bg-green-medium text-white-intense font-nexa px-5 py-3 rounded disabled:opacity-60"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductSummaryPanel);
