import React from "react";
import { RiArrowDownSLine, RiMenu3Line } from "react-icons/ri";

export default function ProductListToolbar({
  handleSearchSubmit,
  searchInput,
  setSearchInput,
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
}) {
  return (
    <section className="relative flex flex-col gap-3 md:flex-row md:gap-16 ">
      <div className="flex w-full items-center gap-3 md:w-9/12">
        <form
          onSubmit={handleSearchSubmit}
          className="w-full h-10 rounded-full px-4 flex items-center justify-between md:h-9 md:px-5"
          style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
        >
          <input
            type="text"
            placeholder="Text here..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent font-nexa text-white-intense placeholder:text-white-intense/80 focus:outline-none"
          />
          <button type="submit" className="ml-4 shrink-0 md:inline-flex">
            <img
              src="https://img.icons8.com/?size=100&id=7eX13e1GI7bn&format=png&color=FFFFFF"
              alt="Search"
              className="w-6 h-6"
            />
          </button>
        </form>
        <button
          ref={mobileToggleRef}
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          className="ml-3 shrink-0 flex h-9 w-9 items-center justify-center rounded-md bg-green-dark text-white-intense md:hidden"
          aria-label="Open filters"
        >
          <RiMenu3Line size={20} />
        </button>
      </div>

      <div ref={sortRef} className="relative hidden w-full md:block md:w-52 md:mr-0">
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
    </section>
  );
}

