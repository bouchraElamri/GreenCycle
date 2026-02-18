import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import logo from "../../assets/Logo-white 2.png";
import searchicon from "../../assets/zoom.png";
import profile from "../../assets/profile.jpg";
import { useRef } from "react";
import { RiMenuSearchFill } from "react-icons/ri";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const drawerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const goToLogin = () => {
    navigate(`/login`);
  };
  const gotosignup = () => {
    navigate(`/register`);
  };
  const switchtoseller = () => {
    navigate("/seller");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    const query = value ? `?name=${encodeURIComponent(value)}` : "";
    navigate(`/product_list${query}`);
  };

  async function handleLogout() {
    setDrawerOpen(false);
    await logout();
    navigate("/");
  }

  // Close drawer with ESC
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        drawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target)
      ) {
        setDrawerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen]);

  useEffect(() => {
    function handleClickOutsidebox(event) {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsidebox);
    return () =>
      document.removeEventListener("mousedown", handleClickOutsidebox);
  }, [sidebarOpen]);

  return (
    <header className="fixed top-6 left-0 w-full z-50">
      <div className="relative flex flex-col mx-6 lg:mx-10 xl:mx-24 2xl:mx-40">
        <nav
          className="flex h-12
                    justify-between 
                    items-center 
                    bg-gradient-to-r from-green-tolerated to-green-dark
                    rounded-full 
                    shadow
                    lg:h-16"
        >
          {/* logo */}
          <Link className="ml-6 shrink-0 lg:ml-6" to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] lg:w-[170px] xl:w-[170px] h-auto"
            />
          </Link>
          {/* navigation : for Desktop */}
          <div className="hidden lg:flex lg:items-center lg:flex-1 lg:justify-end">
            <ul className="flex items-center lg:gap-6 xl:gap-12 mr-0">
              <li>
                <Link
                  to="/product_list"
                  className="inline-flex h-10 w-28 items-center justify-center rounded-full font-nexa text-base font-bold text-white-intense transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                >
                  Products
                </Link>
              </li>
              <li>
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-10 bg-white-intense rounded-full overflow-hidden lg:w-64 xl:w-96"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 h-full rounded-full outline-none text-grayCustom placeholder:text-grayCustom/50"
                  />
                  <button type="submit" className="h-full px-4 transition">
                    <img src={searchicon} alt="Search" className="w-7 h-5" />
                  </button>
                </form>
              </li>

              {!isAuthenticated ? (
                <>
                  <li>
                    <button
                      onClick={goToLogin}
                      className="inline-flex h-10 w-28 items-center justify-center rounded-full font-nexa text-base font-bold text-white-intense transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                    >
                      Login
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={gotosignup}
                      className="inline-flex h-10 w-28 mr-6 items-center justify-center rounded-full font-nexa text-base font-bold text-white-intense transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                    >
                      Sign Up
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <button
                      onClick={switchtoseller}
                      className="inline-flex items-center justify-center h-10 text-white-intense text-lg font-nexa font-bold px-3 py-1 rounded-full transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                    >
                      switch to seller
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => {
                        setDrawerOpen(true);
                      }}
                      className="flex item-center mr-3 w-12 h-12 rounded-full overflow-hidden border-2 border-white-light"
                    >
                      <img
                        src={profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* navigation : for Mobile */}
          {!isAuthenticated ? (
            <>
            <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(true);
              }}
              className="flex items-center mr-6 overflow-hidden border-white-light lg:hidden"
            >
              <RiMenuSearchFill size={30} color="white" />
            </button>
          </div>
            </>
          ) : ( 
          <>
            <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(true);
              }}
              className="flex items-center mr-1 w-10 h-10 rounded-full overflow-hidden border-2 border-white-light lg:hidden"
            >
              <img
                src={profile}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
            </>
          )}
        </nav>

        {/* Right sidebar drawer (desktop only) */}
        <div
          ref={drawerRef}
          className={`hidden lg:flex justify-between mt-5 transition-all duration-200 ease-out
        ${isAuthenticated && drawerOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
        `}
        >
          <div></div>
          <div className="bg-white-broken w-72 shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-3xl bg-white/95 backdrop-blur">
            <div className="flex flex-col items-center py-2">

                <Link
                to="/cart"
                onClick={() => setDrawerOpen(false)}
                className="w-full px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Cart
              </Link>

                <div className="w-[85%] h-px bg-black/10" />

              <Link
                to="/profile"
                onClick={() => setDrawerOpen(false)}
                className="w-full px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Profile
              </Link>

              <div className="w-[85%] h-[0.5px] bg-black/10" />

              <button
                onClick={handleLogout}
                className="w-full px-6 py-3 text-left font-nexa text-xl text-green-dark hover:font-bold transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar drawer (mobile only) */}
        <div
          ref={sidebarRef}
          className={`justify-between mt-5 transition-all duration-200 ease-out lg:hidden
            ${ sidebarOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}
            `}
        >
          <div className="bg-white-broken w-full shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-3xl bg-white/95 backdrop-blur">
            {/* Close button */}
            <div className="flex flex-col items-center py-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="btn btn-circle absolute top-4 right-4 text-2xl text-gray"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="py-6">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex h-10 bg-white-intense rounded-full overflow-hidden lg:w-64 xl:w-96"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-5 h-full rounded-full outline-none text-grayCustom placeholder:text-grayCustom/50"
                  />
                  <button type="submit" className="h-full px-4 transition">
                    <img src={searchicon} alt="Search" className="w-7 h-5" />
                  </button>
                </form>
              </div>

              <div className="w-[85%] h-px bg-black/10" />

              <Link
                to="/product_list"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Products
              </Link>

              <div className="w-[85%] h-[0.5px] bg-black/10" />

              {!isAuthenticated ? (
                <>
                <Link
                to="/login"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Login
              </Link>

                <div className="w-[85%] h-px bg-black/10" />

                <Link
                to="/signup"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Sign Up
              </Link>
               
                </>
              ) : (
                <>
                <Link
                to="/cart"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Cart
              </Link>

                <div className="w-[85%] h-px bg-black/10" />

                <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Switch To Seller
              </Link>

              <div className="w-[85%] h-px bg-black/10" />
              <Link
                to="/profile"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Profile
              </Link>

              <div className="w-[85%] h-px bg-black/10" />

              <button
                onClick={handleLogout}
                className="px-6 py-3 text-left font-nexa text-xl text-green-dark hover:font-bold transition"
              >
                Log Out
              </button>
                </>

              )}

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
