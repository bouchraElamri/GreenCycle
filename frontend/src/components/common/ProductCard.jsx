import React, { memo } from 'react';
import { Link } from 'react-router-dom';
const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
function ProductCard({ product }) {
  return (
    <div className="bg-white-intense rounded-2xl shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img
          src={
            product?.images?.[0]
              ? product.images[0].startsWith("http")
                ? product.images[0]
                : `${apiOrigin}${product.images[0]}`
              : "/assets/images/placeholder_product.png"
          }
          alt={product.name}
          className="w-full h-40 object-cover cursor-pointer"
        />
      </Link>
      <div className="p-4">
        <h2 className="text-sm font-bold font-nexa text-green-medium ">{product.name}</h2>
        <p className="text-sm font-nexa text-green-medium ">{product.price} MAD</p>
      </div>
    </div>
  )
}

export default memo(ProductCard);

