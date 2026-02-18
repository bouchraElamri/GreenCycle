import { useState, useRef, useEffect } from "react";
import useProducts from "../../../hooks/useProducts";
import useCategories from "../../../hooks/useCategories";

const ProductList = () => {
  const { products, loading, error } = useProducts();
  const { categories, loadingCat } = useCategories();

  // SORT dropdown
  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const sortRef = useRef(null);

  // CATEGORY dropdown
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const catRef = useRef(null);

  // ✅ One click-outside handler for both dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
      if (catRef.current && !catRef.current.contains(e.target)) {
        setOpenCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Something went wrong: {error.message}</div>;
  if (!products || products.length === 0) return <div>No products found.</div>;

  const options = [
    { label: "Sort by", value: "" },
    { label: "Newest", value: "newest" },
    { label: "Price: Lowest to highest", value: "asc" },
    { label: "Price: Highest to lowest", value: "desc" },
  ];

  return (
    <main className="md:mx-20 md:my-3">
      {/* TOP BAR */}
      <section className="md:flex gap-24 items-center">
        <input
          type="text"
          className="md:w-9/12 rounded-2xl md:text-white md:pl-2 md:placeholder:text-white h-8 focus:outline-none"
          style={{ background: "linear-gradient(to right, #225026, #588D5B)" }}
          placeholder="Text here..."
        />

        {/* SORT DROPDOWN */}
        <div ref={sortRef} className="relative w-52">
          <button
            onClick={() => setOpenSort((v) => !v)}
            className="hidden md:flex w-full bg-emerald-900 text-white px-4 py-2 rounded-full justify-between items-center h-8"
          >
            {selectedSort}
            <span>▼</span>
          </button>

          {openSort && (
            <div className="absolute mt-2 w-full bg-[#F7F8F6] rounded-2xl shadow-lg overflow-hidden z-50">
              {options.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => {
                    setSelectedSort(opt.label);
                    setOpenSort(false);
                  }}
                  className="px-3 py-2 hover:bg-[#d4d4d4] cursor-pointer text-gray-700 transition"
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="hidden md:flex md:gap-10 mt-7">
        <section className="relative w-1/3 h-full rounded-3xl overflow-hidden">
          <img
            src={"/assets/images/product_filtring.png"} 
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />

          <div className="md:relative md:z-10 md:h-full md:flex md:flex-col md:items-center md:justify-center md:text-black md:text-center md:px-6">
            <h1 className="text-2xl">Craft your path</h1>
            <p className="text-sm mt-1">Curated Sustainable Selection</p>

            <div className="mt-6 w-full text-left">
              <p className="text-base mb-2">Category</p>
              <div ref={catRef} className="relative w-52">
                <button
                  onClick={() => setOpenCategory((v) => !v)}
                  className="w-full bg-white text-[#253D27] px-4 py-2 rounded-full flex justify-between items-center h-8"
                >
                  {selectedCategory}
                  <span>▼</span>
                </button>

                {openCategory && (
                  <div className="absolute mt-2 w-full bg-[#F7F8F6] rounded-2xl shadow-lg overflow-hidden z-50">
                    {loadingCat && (
                      <div className="px-3 py-2 text-gray-600">Loading...</div>
                    )}

                    {!loadingCat &&
                      categories?.map((cat) => (
                        <div
                          key={cat._id}
                          onClick={() => {
                            setSelectedCategory(cat.name);
                            setOpenCategory(false);
                          }}
                          className="px-3 py-2 hover:bg-[#d4d4d4] cursor-pointer text-gray-700 transition"
                        >
                          {cat.name}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section>{/* products grid here */}</section>
      </div>
    </main>
  );
};

export default ProductList;
