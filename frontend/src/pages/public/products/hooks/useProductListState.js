import { useState, useRef, useEffect, useMemo, useCallback } from "react";

export default function useProductListState(
  products,
  { initialCategoryId = "", initialCategoryName = "Category" } = {}
) {
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const [selectedSortValue, setSelectedSortValue] = useState("");
  const sortRef = useRef(null);
  const mobilePanelRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategoryName || "Category"
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    initialCategoryId || ""
  );
  const [appliedFilters, setAppliedFilters] = useState({
    categoryId: initialCategoryId || "",
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
    const nextCategoryId = initialCategoryId || "";
    setSelectedCategoryId(nextCategoryId);
    setSelectedCategory(nextCategoryId ? initialCategoryName || "Category" : "Category");
    setAppliedFilters((prev) => ({ ...prev, categoryId: nextCategoryId }));
    setCurrentPage(1);
  }, [initialCategoryId, initialCategoryName]);

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
    let result = filteredProducts;

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
  }, [filteredProducts, selectedSortValue]);

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

  return {
    openSort,
    setOpenSort,
    selectedSort,
    setSelectedSort,
    selectedSortValue,
    setSelectedSortValue,
    sortRef,
    mobilePanelRef,
    mobileToggleRef,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    openCategory,
    setOpenCategory,
    selectedCategory,
    setSelectedCategory,
    selectedCategoryId,
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
  };
}

