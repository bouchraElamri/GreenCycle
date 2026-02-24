import React, { memo } from "react";
import ProductCard from "../../../../components/common/ProductCard";
import Pagination from "../../../../components/common/Pagination";

function RelatedProductsSection({ currentProducts, totalPages, currentPage, setCurrentPage }) {
  return (
    <section>
      <h2 className="text-green-dark text-2xl font-nexa font-bold mt-8 mb-4 text-center">
        Related Products
      </h2>
      <div>
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {currentProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700">No related products found.</p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      )}
    </section>
  );
}

export default memo(RelatedProductsSection);
