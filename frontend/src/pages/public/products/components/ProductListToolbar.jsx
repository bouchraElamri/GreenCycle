import React from "react";
import { RiArrowDownSLine, RiMenu3Line } from "react-icons/ri";
import { RiArrowLeftLine } from "react-icons/ri";
import { Link } from "react-router-dom";

export default function ProductListToolbar({
  mobileToggleRef,
  setMobileFiltersOpen,
  sortRef,
  openSort,
  setOpenSort,
  selectedSort,
  options,
  setSelectedSort,
  setSelectedSortValue,
  setCurrentPage,
  hasNavbarSearch
}) {
  return (
    <section className="relative">
      <div className="flex items-center justify-between md:hidden">
        {hasNavbarSearch ? (
          <Link
            to="/product_list"
            aria-label="Back to product list"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-green-dark text-green-dark
             bg-white-intense transition-all duration-300 hover:border-white-intense hover:bg-green-dark 
             hover:text-white-intense hover:opacity-80"
          >
            <RiArrowLeftLine size={16} />
          </Link>
        ) : (
          <span />
        )}

        <button
          ref={mobileToggleRef}
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="shrink-0 flex h-9 w-9 items-center justify-center rounded-md bg-green-dark text-white-intense"
          aria-label="Open filters"
        >
          <RiMenu3Line size={20} />
        </button>
      </div>

      <div className="hidden md:flex md:items-center md:justify-between md:gap-3">
        {hasNavbarSearch ? (
          <Link
            to="/product_list"
            aria-label="Back to product list"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-green-dark text-green-dark bg-white-intense transition-all duration-300 hover:border-white-intense hover:bg-green-dark hover:text-white-intense hover:opacity-80"
          >
            <RiArrowLeftLine size={16} />
          </Link>
        ) : (
          <span />
        )}

        <div ref={sortRef} className="relative ml-auto w-52">
          <button
            onClick={() => {
              setOpenSort((v) => !v);
            }}
            className="flex w-full bg-green-dark font-nexa text-xs text-white-intense px-4 py-2 rounded-full justify-between items-center h-9"
          >
            {selectedSort}
            <RiArrowDownSLine size={18} />
          </button>

          {openSort && (
            <div className="absolute mt-2 w-full bg-white-intense font-nexa rounded-2xl shadow-lg overflow-hidden z-20">
              {options.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => {
                    setSelectedSort(opt.label);
                    setSelectedSortValue(opt.value);
                    setOpenSort(false);
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 hover:bg-white-broken cursor-pointer text-gray-700 transition"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
