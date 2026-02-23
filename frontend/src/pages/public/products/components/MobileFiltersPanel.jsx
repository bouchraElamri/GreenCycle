import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import ProductFiltring from "../../../../components/common/ProductFiltring";

export default function MobileFiltersPanel({
  mobileFiltersOpen,
  mobilePanelRef,
  sortRef,
  openSort,
  setOpenSort,
  selectedSort,
  options,
  setSelectedSort,
  setSelectedSortValue,
  setCurrentPage,
  categories,
  loadingCat,
  catRef,
  openCategory,
  setOpenCategory,
  selectedCategory,
  setSelectedCategory,
  setSelectedCategoryId,
  min,
  max,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  minPercent,
  maxPercent,
  handleShowResult,
  handleResetFilters,
  setMobileFiltersOpen,
}) {
  if (!mobileFiltersOpen) return null;

  return (
    <div className="fixed inset-0 z-40 bg-black/30 md:hidden">
      <div
        ref={mobilePanelRef}
        className="absolute right-0 top-36 h-[calc(100%-5rem)] w-[88%] max-w-sm overflow-y-auto bg-white-intense p-4 shadow-xl rounded-lg"
      >
        <div ref={sortRef} className="relative w-full mb-4">
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

        <ProductFiltring
          categories={categories}
          loadingCat={loadingCat}
          catRef={catRef}
          openCategory={openCategory}
          setOpenCategory={setOpenCategory}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedCategoryId={setSelectedCategoryId}
          min={min}
          max={max}
          minValue={minValue}
          setMinValue={setMinValue}
          maxValue={maxValue}
          setMaxValue={setMaxValue}
          minPercent={minPercent}
          maxPercent={maxPercent}
          onShowResult={() => {
            handleShowResult();
            setMobileFiltersOpen(false);
          }}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
}

