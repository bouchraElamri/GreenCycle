import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import useProducts from "../../../hooks/useProducts";
import useCategories from "../../../hooks/useCategories";
import MainLayout from "../../../components/layouts/MainLayout";
import ProductCard from "../../../components/common/ProductCard";
import Pagination from "../../../components/common/Pagination";
import ProductFiltring from "../../../components/common/ProductFiltring";
import { RiArrowDownSLine, RiMenu3Line } from "react-icons/ri";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { categories, loadingCat } = useCategories();

  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const [selectedSortValue, setSelectedSortValue] = useState("");
  const sortRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    categoryId: "",
    min: null,
    max: null,
  });
  const catRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);


  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const { min, max } = useMemo(() => {
    const priceValues = products
      .map((p) => Number(p.price))
      .filter((n) => Number.isFinite(n));
    return {
      min: priceValues.length ? Math.min(...priceValues) : 0,
      max: priceValues.length ? Math.max(...priceValues) : 0,
    };
  }, [products]);
  const priceRange = max - min || 1;

  // percentage calculation
  const minPercent = ((minValue - min) / priceRange) * 100;
  const maxPercent = ((maxValue - min) / priceRange) * 100;

  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCategory(false);
      }
      if (
        mobileFiltersOpen &&
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(e.target) &&
        mobileToggleRef.current &&
        !mobileToggleRef.current.contains(e.target)
      ) {
        setMobileFiltersOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileFiltersOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  useEffect(() => {
    setMinValue(min);
    setMaxValue(max);
  }, [min, max]);


  const options = useMemo(
    () => [
      { label: "Sort by", value: "" },
      { label: "Newest", value: "newest" },
      { label: "Price: Lowest to highest", value: "asc" },
      { label: "Price: Highest to lowest", value: "desc" },
    ],
    []
  );

  const hasCategoryFilter = Boolean(appliedFilters.categoryId);
  const hasPriceFilter =
    appliedFilters.min !== null && appliedFilters.max !== null;

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const price = Number(product.price);
        const matchesPrice = !hasPriceFilter
          ? true
          : Number.isFinite(price) &&
          price >= appliedFilters.min &&
          price <= appliedFilters.max;

        if (!hasCategoryFilter) return matchesPrice;

        const categoryValue =
          typeof product.category === "object" && product.category !== null
            ? String(product.category._id || "")
            : String(product.category || "");

        const matchesCategory = categoryValue === appliedFilters.categoryId;

        return matchesPrice && matchesCategory;
      }),
    [products, hasPriceFilter, hasCategoryFilter, appliedFilters]
  );

  const searchedAndSortedProducts = useMemo(() => {
    const normalizedQuery = appliedSearch.trim().toLowerCase();

    let result = normalizedQuery
      ? filteredProducts.filter((product) =>
        String(product.name || "").toLowerCase().includes(normalizedQuery)
      )
      : filteredProducts;

    if (selectedSortValue === "newest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (selectedSortValue === "asc") {
      result = [...result].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (selectedSortValue === "desc") {
      result = [...result].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    return result;
  }, [filteredProducts, appliedSearch, selectedSortValue]);

  const productsPerPage = 9;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(searchedAndSortedProducts.length / productsPerPage)),
    [searchedAndSortedProducts.length]
  );
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return searchedAndSortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [searchedAndSortedProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory("Category");
    setSelectedCategoryId("");
    setMinValue(min);
    setMaxValue(max);
    setAppliedFilters({ categoryId: "", min: null, max: null });
    setCurrentPage(1);
  }, [min, max]);

  const handleShowResult = useCallback(() => {
    setAppliedFilters({
      categoryId: selectedCategoryId,
      min: minValue,
      max: maxValue,
    });
    setCurrentPage(1);
  }, [selectedCategoryId, minValue, maxValue]);

  const handleSearchSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setAppliedSearch(searchInput);
      setCurrentPage(1);
    },
    [searchInput]
  );

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div>Something went wrong: {error.message}</div>;
  if (!products || products.length === 0) return <div className="text-center py-10">No products found.</div>;

  return (
    <MainLayout>
      <main className="mt-24  mx-6 md:mt-32 md:px-0 md:mx-24 ">
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
              <button type="submit" className="ml-4 shrink-0  md:inline-flex">
                <img src="https://img.icons8.com/?size=100&id=7eX13e1GI7bn&format=png&color=FFFFFF" alt="Search" className="w-6 h-6" />
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
                setOpenSort((v) => !v)
              }
              }
              className="flex w-full bg-green-dark font-nexa text-xs 
            text-white-intense px-4 py-2 rounded-full justify-between items-center h-9"
            >
              {selectedSort}
              <RiArrowDownSLine size={18} />
            </button>

            {openSort && (
              <div className="absolute mt-2 w-full bg-white-intense font-nexa
                           rounded-2xl shadow-lg overflow-hidden z-20">
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

          <section className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {currentProducts.length === 0 && (
              <p className="mt-6 text-center font-nexa text-gray-600">No matching products found.</p>
            )}
            {totalPages > 1 && (
              <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            )}
          </section>
        </div>

        {mobileFiltersOpen && (
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
        )}
      </main>
    </MainLayout>
  );
};

export default ProductList;
