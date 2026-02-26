import React, { useEffect, useMemo, useRef, useState } from "react";
import fire from "../../assets/fire.png";
import publicApi from "../../api/publicApi";
import NewestProductsCarousel from "./NewestProductsCarousel";

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
  const dragThresholdRef = useRef(0);

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
          const normalized = (Array.isArray(data) ? data : [])
            .map((item) => ({
              _id: item?._id || item?.id || null,
              name: item?.name || "Unnamed product",
              createdAt: item?.createdAt,
              image: normalizeImage(item?.images?.[0]),
            }))
            .filter((item) => item._id);
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
    if (event.target.closest("a, button, input, textarea, select, label")) return;
    dragStartXRef.current = event.clientX;
    didDragRef.current = false;
    dragThresholdRef.current = 0;
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const nextOffset = event.clientX - dragStartXRef.current;
    dragThresholdRef.current = Math.max(dragThresholdRef.current, Math.abs(nextOffset));
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  const handlePointerEnd = () => {
    if (!isDragging || dragStartXRef.current === null) return;

    const threshold = 60;
    const wasSwipe = dragThresholdRef.current >= threshold;
    didDragRef.current = wasSwipe;

    if (dragOffsetRef.current <= -threshold && currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (dragOffsetRef.current >= threshold && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }

    dragStartXRef.current = null;
    setIsDragging(false);
    dragOffsetRef.current = 0;
    setDragOffset(0);
    dragThresholdRef.current = 0;
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

      <NewestProductsCarousel
        loading={loading}
        error={error}
        products={products}
        isDragging={isDragging}
        currentPage={currentPage}
        totalPages={totalPages}
        dragOffset={dragOffset}
        pages={pages}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerEnd={handlePointerEnd}
        handleClickCapture={handleClickCapture}
        setCurrentPage={setCurrentPage}
      />
    </section>
  );
};

export default NewestProducts;
