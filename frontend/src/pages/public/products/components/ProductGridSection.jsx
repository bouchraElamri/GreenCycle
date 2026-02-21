import React from "react";
import ProductCard from "../../../../components/common/ProductCard";
import Pagination from "../../../../components/common/Pagination";

export default function ProductGridSection({
  currentProducts,
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  return (
    <section className="w-full md:min-h-[640px] md:flex md:flex-col">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      {currentProducts.length === 0 && (
        <p className="mt-6 text-center font-nexa text-gray-600">No matching products found.</p>
      )}
      {totalPages > 1 && (
        <div className="md:mt-auto md:pt-6">
          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
        </div>
      )}
    </section>
  );
}

