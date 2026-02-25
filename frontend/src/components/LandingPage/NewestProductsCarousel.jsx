import React from "react";
import CategoriesCard from "../common/CategoriesCard";

const NewestProductsCarousel = ({
  loading,
  error,
  products,
  isDragging,
  currentPage,
  totalPages,
  dragOffset,
  pages,
  handlePointerDown,
  handlePointerMove,
  handlePointerEnd,
  handleClickCapture,
  setCurrentPage,
}) => {
  return (
    <>
      <div className="mx-6 md:mx-24 xl:mx-38 relative isolate">
        <div className="pointer-events-none absolute -left-10 top-1/2 -z-10 h-full w-20 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0)_80%)] blur-md" />
        <div className="pointer-events-none absolute -right-10 top-1/2 -z-10 h-full w-20 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0)_80%)] blur-md" />
        <div className="pointer-events-none absolute inset-y-0 -left-16 z-20 w-14 bg-white-intense" />
        <div className="pointer-events-none absolute inset-y-0 -right-16 z-20 w-14 bg-white-intense" />

        {loading ? (
          <p className="py-10 text-center font-nexa text-green-dark">Loading newest products...</p>
        ) : error ? (
          <p className="py-10 text-center font-nexa text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <p className="py-10 text-center font-nexa text-green-dark">No products found.</p>
        ) : (
          <div
            className={`overflow-hidden ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onPointerLeave={handlePointerEnd}
            onClick={handleClickCapture}
            style={{ touchAction: "pan-y" }}
          >
            <div
              className={`flex ${isDragging ? "" : "transition-transform duration-500 ease-in-out"}`}
              style={{
                transform: `translateX(calc(-${(currentPage - 1) * 100}% + ${dragOffset}px))`,
              }}
            >
              {pages.map((pageProducts, pageIndex) => (
                <div key={`newest-page-${pageIndex}`} className="min-w-full grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-3">
                  {pageProducts.map((product) => (
                    <div key={product._id} className="flex flex-col">
                      <CategoriesCard
                        title={product.name}
                        image={product.image}
                        to={`/product/${product._id}`}
                        className="mx-auto w-[78%] h-64 md:w-[80%] md:h-80"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {!loading && !error && products.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-5">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = currentPage === page;

            return (
              <button
                key={`newest-dot-${page}`}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-4 w-4  md:h-5 md:w-5 rounded-full ${
                  isActive
                    ? "bg-gradient-to-r from-green-tolerated to-green-dark shadow-[0_8px_18px_rgba(14,79,55,0.25)]"
                    : "border-[1px] border-green-dark/85 bg-transparent hover:bg-green-dark/10"
                }`}
                aria-label={`Go to newest products page ${page}`}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

export default NewestProductsCarousel;
