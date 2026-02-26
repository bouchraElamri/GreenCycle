import React, { useEffect, useMemo, useRef } from "react";
import CategoriesCard from "../common/CategoriesCard";
import Symbol1 from "../../assets/Symbol1.png";
import Symbol2 from "../../assets/Symbol2.png";
import useCategories from "../../hooks/useCategories";

const API_ORIGIN = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

function resolveCategoryImage(path) {
  if (!path) return "/assets/images/placeholder_product.png";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_ORIGIN}${path}`;
  return `${API_ORIGIN}/${path}`;
}

const Categories = () => {
  const mobileScrollerRef = useRef(null);
  const isInteractingRef = useRef(false);
  const { categories } = useCategories();

  const cards = useMemo(
    () =>
      (Array.isArray(categories) ? categories : []).map((category) => ({
        id: category?._id || category?.name,
        title: category?.name || "Category",
        image: resolveCategoryImage(category?.img),
        to: category?._id
          ? `/product_list?categoryId=${encodeURIComponent(category._id)}&categoryName=${encodeURIComponent(
              category?.name || ""
            )}`
          : "/product_list",
      })),
    [categories]
  );

  const columns = useMemo(
    () => [
      cards.filter((_, index) => index % 4 === 0),
      cards.filter((_, index) => index % 4 === 1),
      cards.filter((_, index) => index % 4 === 2),
      cards.filter((_, index) => index % 4 === 3),
    ],
    [cards]
  );

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    let rafId = null;
    let lastTs = 0;
    const pxPerSecond = 24;

    const tick = (ts) => {
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      if (!isInteractingRef.current) {
        scroller.scrollLeft += pxPerSecond * dt;
        const half = scroller.scrollWidth / 2;
        if (half > 0 && scroller.scrollLeft >= half) {
          scroller.scrollLeft -= half;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const startInteract = () => {
      isInteractingRef.current = true;
    };
    const stopInteract = () => {
      isInteractingRef.current = false;
    };

    scroller.addEventListener("pointerdown", startInteract);
    window.addEventListener("pointerup", stopInteract);
    scroller.addEventListener("touchstart", startInteract, { passive: true });
    scroller.addEventListener("touchend", stopInteract, { passive: true });
    scroller.addEventListener("mouseenter", startInteract);
    scroller.addEventListener("mouseleave", stopInteract);

    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      scroller.removeEventListener("pointerdown", startInteract);
      window.removeEventListener("pointerup", stopInteract);
      scroller.removeEventListener("touchstart", startInteract);
      scroller.removeEventListener("touchend", stopInteract);
      scroller.removeEventListener("mouseenter", startInteract);
      scroller.removeEventListener("mouseleave", stopInteract);
    };
  }, []);

  return (
    <section className="relative rounded-[4rem] z-20 w-full overflow-hidden bg-white-intense py-10 md:py-3">
      <div className="w-full md:h-[12rem] bg-white-intense">
            <div className="flex justify-center items-center gap-3 md:gap-5 w-full h-full text-[2rem] md:text-[3rem] text-green-medium font-nexa font-bold">
                <img src={Symbol1} alt="Left symbol" className="mb-[4rem] md:mb-0 w-8 h-8 md:w-12 md:h-12 object-contain" />
                <h1 className="mb-[4rem] md:mb-0">Choose Your Path</h1>
                <img src={Symbol2} alt="Right symbol" className="mb-[4rem] md:mb-0 w-8 h-8 md:w-12 md:h-12 object-contain" />
            </div>
          </div>
      <div className="w-full md:hidden">
        <div className="px-4">
          <div
            ref={mobileScrollerRef}
            className="flex gap-3 overflow-x-auto pb-2 touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...cards, ...cards].map((card, index) => (
              <CategoriesCard
                key={`mobile-${card.id}-${index}`}
                title={card.title}
                image={card.image}
                to={card.to}
                className="min-w-[210px] w-[210px] h-64 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="hidden w-full md:block">
        <div className="relative isolate">
          <div className="pointer-events-none absolute left-1/2 -top-8 -z-10 h-28 w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0)_78%)] blur-md" />
          <div className="pointer-events-none absolute left-1/2 -bottom-8 -z-10 h-28 w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.12)_42%,rgba(0,0,0,0)_78%)] blur-md" />
          <div className="pointer-events-none absolute inset-x-0 -top-16 z-20 h-20 bg-white-intense" />
          <div className="pointer-events-none absolute inset-x-0 -bottom-16 z-20 h-20 bg-white-intense" />

          <div className="mx-6 md:mx-24 xl:mx-38 relative z-10 grid grid-cols-2 gap-x-1 md:grid-cols-4 md:gap-x-1">
            {columns.map((columnCards, columnIndex) => (
              <div
                key={`column-${columnIndex}`}
                className="categories-column h-[540px] overflow-hidden"
              >
                <div
                  className={`categories-track ${
                    columnIndex % 2 ? "categories-track-reverse" : ""
                  }`}
                >
                  {[...columnCards, ...columnCards].map((card, itemIndex) => (
                    <CategoriesCard
                      key={`${card.id}-${itemIndex}`}
                      title={card.title}
                      image={card.image}
                      to={card.to}
                      className="mx-auto w-[68%] h-64 md:w-[70%] md:h-80 mb-3 md:mb-4"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
