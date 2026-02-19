import { useState, useRef, useEffect,  } from "react";
import useProducts from "../../../hooks/useProducts";
import useCategories from "../../../hooks/useCategories";
import MainLayout from "../../../components/layouts/MainLayout";
import Button from "../../../components/ui/Button";
import { ReactComponent as YourSvg } from "../../../assets/Logo-category.svg";

import { Link } from "react-router-dom";

const ProductList = () => {
  const { products, loading, error } = useProducts();console.log(products);
  const { categories, loadingCat } = useCategories();
  const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

  const [openSort, setOpenSort] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sort by");
  const sortRef = useRef(null);

  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const catRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);


  const [minValue, setMinValue] = useState(60);
  const [maxValue, setMaxValue] = useState(500);

  const min = 0;
  const max = 1000;

  // percentage calculation
  const minPercent = ((minValue - min) / (max - min)) * 100;
  const maxPercent = ((maxValue - min) / (max - min)) * 100;




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

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  if (loading) return <div className="text-center py-10">Loading products...</div>;
  if (error) return <div>Something went wrong: {error.message}</div>;
  if (!products || products.length === 0) return <div className="text-center py-10">No products found.</div>;

  const options = [
    { label: "Sort by", value: "" },
    { label: "Newest", value: "newest" },
    { label: "Price: Lowest to highest", value: "asc" },
    { label: "Price: Highest to lowest", value: "desc" },
  ];

  const productsPerPage = 9;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  return (
    <MainLayout>
      <main className="pt-0 md:mx-24 mt-28">
        <section className="relative md:flex gap-24 items-center z-50">
          <form
            className="md:w-9/12 md:h-9 rounded-full px-5 flex items-center justify-between "
            style={{ background: "linear-gradient(to right, #1E5A2A, #5F9A62)" }}
          >
            <input
              type="text"
              placeholder="Text here..."
              className="w-full bg-transparent font-nexa text-white-intense placeholder:text-white-intense/80 focus:outline-none"
            />
            <button type="submit" className="ml-4 shrink-0">
              <img src="https://img.icons8.com/?size=100&id=7eX13e1GI7bn&format=png&color=FFFFFF" alt="Search" className="w-6 h-6" />
            </button>
          </form>
          <div ref={sortRef} className="hidden md:flex md:relative md:w-52">
            <button
              onClick={() => {
                setOpenSort((v) => !v)
              }
              }
              className="hidden md:flex w-full bg-green-dark md:font-nexa md:text-xs 
            md:text-white-intense md:px-4 md:py-2 md:rounded-full md:justify-between md:items-center md:h-9"
            >
              {selectedSort}
              <span>▼</span>
            </button>

            {openSort && (
              <div className="md:absolute md:mt-8 md:w-full md:bg-white-intense md:font-nexa
                           md:rounded-2xl md:shadow-lg md:overflow-hidden md:z-50">
                {options.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => {
                      setSelectedSort(opt.label);
                      setOpenSort(false);
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

        <div className="hidden md:flex md:gap-10 md:mt-16 md:pb-5">
          <section className="relative w-80  rounded-3xl overflow-hidden md:h-5/6">
            <img
              src={"/assets/images/product_filtring.png"}
              alt="background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-white-intense/80 backdrop-blur-sm pointer-events-none" />

            <div className="md:relative md:z-10 md:h-full md:flex md:flex-col md:items-center
           md:justify-center md:text-black md:text-center md:py-10 md:px-6">
              <h1 className="md:text-2xl md:font-nexa md:font-semibold ">Craft your path</h1>
              <p className="md:text-sm mt-1 font-nexa ">Curated Sustainable Selection</p>

              <div className="my-9 w-full text-left">
                <p className="text-base mb-4 font-nexa text-green-dark">Category</p>
                <div ref={catRef} className=" ">
                  <button
                    onClick={() => setOpenCategory((v) => !v)}
                    className="z-50 w-full bg-white-intense text-green-dark px-4 py-2 text-xs font-nexa 
                    rounded-full flex justify-between items-center h-8"
                  ><span> <YourSvg className="flex"/> </span> 
                    {selectedCategory}
                    <span>▼</span>
                  </button>

                  {openCategory && (
                    <div
                      className="absolute mt-2 w-4/6 bg-white-intense rounded-2xl text-xs font-nexa
                                  hadow-lg z-40 max-h-40 overflow-y-auto">
                      {loadingCat && <div className="px-3 py-2 text-gray-600 text-center">Loading...</div>}

                      {!loadingCat &&
                        categories?.map((cat) => (
                          <div
                            key={cat._id}
                            onClick={() => {
                              setSelectedCategory(cat.name);
                              setOpenCategory(false);
                            }}
                            className="px-3 py-2 hover:bg-white-broken cursor-pointer text-gray-700"
                          >
                            {cat.name}
                          </div>
                        ))}
                    </div>
                  )}

                </div>
              </div>
              <div className="w-full py-4 text-left pt-1 pb-4">
                <p className="text-md font-nexa text-green-dark mb-4">Price</p>

                {/* MIN */}
                <label className="text-xs font-nexa text-gray-600">min</label>
                <div className="relative w-full mb-6">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={minValue}
                    onChange={(e) => setMinValue(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent pointer-events-auto"
                    style={{
                      background: `linear-gradient(to right, 
          #4F8F5B 0%, 
          #4F8F5B ${minPercent}%, 
          #E5E5E5 ${minPercent}%, 
          #E5E5E5 100%)`
                    }}
                  />

                  <div
                    className="absolute text-xs font-nexa text-gray-600"
                    style={{ left: `${minPercent}%`, transform: "translateX(-50%)" }}
                  >
                    {minValue}
                  </div>
                </div>

                {/* MAX */}
                <label className="text-xs font-nexa text-gray-600">max</label>
                <div className="relative w-full">
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    className="w-full appearance-none bg-transparent"
                    style={{
                      background: `linear-gradient(to right, 
          #4F8F5B 0%, 
          #4F8F5B ${maxPercent}%, 
          #E5E5E5 ${maxPercent}%, 
          #E5E5E5 100%)`
                    }}
                  />

                  <div
                    className="absolute text-xs font-nexa text-gray-600"
                    style={{ left: `${maxPercent}%`, transform: "translateX(-50%)" }}
                  >
                    {maxValue}
                  </div>
                </div>
              </div>
              <div className="md:w-full md:z-50 md:pointer-events-auto md:mt-4">
                <Button base="md:w-full md:justify-center md:px-8 h-8 text-center font-nexa text-sm" variant="green">
                  Show result 
                </Button>
                <Button base="w-full justify-center px-8 h-8 text-center font-nexa text-sm mt-2" variant="white">
                  Reset filters
                </Button>
              </div>
            </div>
          </section>

          <section >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
              {currentProducts.map((product) => (
                <div key={product._id} 
                className="bg-white-intense rounded-2xl shadow-md overflow-hidden">
                  <Link to={`/product/${product._id}`}>
                    <img
                      src={
                        product?.images?.[0]
                          ? product.images[0].startsWith("http")
                            ? product.images[0]
                            : `${apiOrigin}${product.images[0]}`
                          : "/assets/images/placeholder_product.png"
                      }
                      alt={product.name}
                      className="w-full h-40 object-cover cursor-pointer"
                    />
                  </Link>
                  <div className="p-4">
                    <h2 className="text-sm font-bold font-nexa text-green-medium ">{product.name}</h2>
                    <p className="text-sm font-nexa text-green-medium ">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-md bg-green-dark text-white-intense disabled:opacity-40"
                >
                  {"<"}
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-full text-xs font-nexa border ${
                      currentPage === page
                        ? "bg-green-dark text-white-intense border-green-dark"
                        : "bg-white-intense text-green-dark border-green-dark/40"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-md bg-green-dark text-white-intense disabled:opacity-40"
                >
                  {">"}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </MainLayout>
  );
};

export default ProductList;
