import React from 'react';
import useProducts from "../../../hooks/useProducts";

const ProductList = () => {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Something went wrong: {error.message}</div>;
  }

  if (!products || products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div className="">
    </div>
  );
};

export default ProductList;
