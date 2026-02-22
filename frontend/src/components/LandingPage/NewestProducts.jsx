import React, { useEffect, useMemo, useRef, useState } from "react";
import CategoriesCard from "../common/CategoriesCard";
import fire from "../../assets/fire.png";
import publicApi from "../../api/publicApi";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");
const MAX_PRODUCTS = 12;

function normalizeImage(path) {
  if (!path) return "/assets/images/placeholder_product.png";
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
}

const NewestProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartXRef = useRef(null);
  const dragOffsetRef = useRef(0);
  const didDragRef = useRef(false);

  useEffect(() => {
    const updateProductsPerPage = () => {
      if (window.innerWidth < 640) {
        setProductsPerPage(1);
        return;
      }
      if (window.innerWidth < 1024) {
        setProductsPerPage(2);
        return;
      }
      setProductsPerPage(3);
    };

    updateProductsPerPage();
    window.addEventListener("resize", updateProductsPerPage);
    return () => window.removeEventListener("resize", updateProductsPerPage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNewestProducts() {
      try {
        setLoading(true);
        setError("");
        const data = await publicApi.getNewestProducts(MAX_PRODUCTS);

        if (isMounted) {
          const normalized = (Array.isArray(data) ? data : []).map((item) => ({
            _id: item?._id || `tmp-${Math.random().toString(36).slice(2)}`,
            name: item?.name || "Unnamed product",
            createdAt: item?.createdAt,
            image: normalizeImage(item?.images?.[0]),
          }));
          setProducts(normalized);
          setCurrentPage(1);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || "Failed to load newest products");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNewestProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(products.length / productsPerPage)),
    [products.length, productsPerPage]
  );

  const pages = useMemo(() => {
    const list = [];
    for (let page = 0; page < totalPages; page += 1) {
      const start = page * productsPerPage;
      list.push(products.slice(start, start + productsPerPage));
    }
    return list;
  }, [products, totalPages, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [productsPerPage]);

  useEffect(() => {
    setDragOffset(0);
    dragOffsetRef.current = 0;
  }, [currentPage]);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragStartXRef.current = event.clientX;
    didDragRef.current = false;
    setIsDragging(true);
    if (event.currentTarget.setPointerCapture) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handlePointerMove = (event) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const nextOffset = event.clientX - dragStartXRef.current;
    if (Math.abs(nextOffset) > 6) {
      didDragRef.current = true;
    }
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const handlePointerEnd = () => {
    if (!isDragging || dragStartXRef.current === null) return;

    const threshold = 60;
    if (dragOffsetRef.current <= -threshold && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (dragOffsetRef.current >= threshold && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }

    dragStartXRef.current = null;
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setDragOffset(0);
  };

  const handleClickCapture = (event) => {
    if (didDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      didDragRef.current = false;
    }
  };

  return (
    <section className="relative z-20 w-full overflow-hidden bg-white-intense py-10 md:py-6">
      <div className="w-full md:h-[12rem] bg-white-intense">
        <div className="flex justify-center items-center gap-3 md:gap-5 w-full h-full text-[2rem] md:text-[3rem] text-green-medium font-nexa font-bold">
          <img src={fire} alt="Left fire" className="mb-[4rem] md:mb-0 w-8 h-8 md:w-24 md:h-20 object-contain opacity-50" />
          <h1 className="mb-[4rem] md:mb-0">Try this fire</h1>
          <img src={fire} alt="Right fire" className="mb-[4rem] md:mb-0 w-8 h-8 md:w-24 md:h-20 object-contain opacity-50" />
        </div>
      </div>

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
          <>
            <div
              className={`overflow-hidden ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
              onPointerDownCapture={handlePointerDown}
              onPointerMoveCapture={handlePointerMove}
              onPointerUpCapture={handlePointerEnd}
              onPointerCancelCapture={handlePointerEnd}
              onPointerLeaveCapture={handlePointerEnd}
              onClickCapture={handleClickCapture}
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

          </>
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
    </section>
  );
};

export default NewestProducts;
