import useProducts from "../../../hooks/useProducts";
import useCategories from "../../../hooks/useCategories";
import MainLayout from "../../../components/layouts/MainLayout";
import ProductFiltring from "../../../components/common/ProductFiltring";
import useProductListState from "./hooks/useProductListState";
import ProductListToolbar from "./components/ProductListToolbar";
import ProductGridSection from "./components/ProductGridSection";
import MobileFiltersPanel from "./components/MobileFiltersPanel";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { categories, loadingCat } = useCategories();
  const [searchParams] = useSearchParams();

  const initialCategoryId = searchParams.get("categoryId") || "";
  const initialCategoryName = searchParams.get("categoryName") || "Category";

  const initialFilters = useMemo(
    () => ({
      initialCategoryId,
      initialCategoryName,
    }),
    [initialCategoryId, initialCategoryName]
  );

  const {
    openSort,
    setOpenSort,
    selectedSort,
    setSelectedSort,
    setSelectedSortValue,
    sortRef,
    mobilePanelRef,
    mobileToggleRef,
    searchInput,
    setSearchInput,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    openCategory,
    setOpenCategory,
    selectedCategory,
    setSelectedCategory,
    setSelectedCategoryId,
    catRef,
    currentPage,
    setCurrentPage,
    minValue,
    setMinValue,
    maxValue,
    setMaxValue,
    min,
    max,
    minPercent,
    maxPercent,
    options,
    currentProducts,
    totalPages,
    handleResetFilters,
    handleShowResult,
    handleSearchSubmit,
  } = useProductListState(products, initialFilters);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div>Something went wrong: {error.message}</div>;
  if (!products || products.length === 0) return <div className="text-center py-10">No products found.</div>;

  return (
    <MainLayout>
      <main className="mt-24  mx-6 md:mt-32 md:px-0 md:mx-24 ">
        <ProductListToolbar
          handleSearchSubmit={handleSearchSubmit}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          mobileToggleRef={mobileToggleRef}
          setMobileFiltersOpen={setMobileFiltersOpen}
          sortRef={sortRef}
          openSort={openSort}
          setOpenSort={setOpenSort}
          selectedSort={selectedSort}
          options={options}
          setSelectedSort={setSelectedSort}
          setSelectedSortValue={setSelectedSortValue}
          setCurrentPage={setCurrentPage}
        />

        <div className="flex flex-col gap-6 mt-8 pb-5 md:flex-row md:gap-10 md:mt-10">
          <div className="hidden md:block">
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
              onShowResult={handleShowResult}
              onResetFilters={handleResetFilters}
            />
          </div>

          <ProductGridSection
            currentProducts={currentProducts}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <MobileFiltersPanel
          mobileFiltersOpen={mobileFiltersOpen}
          mobilePanelRef={mobilePanelRef}
          sortRef={sortRef}
          openSort={openSort}
          setOpenSort={setOpenSort}
          selectedSort={selectedSort}
          options={options}
          setSelectedSort={setSelectedSort}
          setSelectedSortValue={setSelectedSortValue}
          setCurrentPage={setCurrentPage}
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
          handleShowResult={handleShowResult}
          handleResetFilters={handleResetFilters}
          setMobileFiltersOpen={setMobileFiltersOpen}
        />
      </main>
    </MainLayout>
  );
};

export default ProductList;
