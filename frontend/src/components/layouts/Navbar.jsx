import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useContext, useEffect, useState, useRef } from "react";
import logo from "../../assets/Logo-white 2.png";
import searchicon from "../../assets/zoom.png";
import profile from "../../assets/profile.jpg";
import pdpph from "../../assets/pdpph.png";
import { RiMenuSearchFill } from "react-icons/ri";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, role } = useContext(AuthContext);

  const drawerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ NEW: 0..1 progressive haze opacity
  const [fadeProgress, setFadeProgress] = useState(0);

  const goToLogin = () => navigate(`/login`);
  const gotosignup = () => navigate(`/register`);
  const switchtoseller = () => navigate("/seller");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    const query = value ? `?name=${encodeURIComponent(value)}` : "";
    navigate(`/product_list${query}`);
    setSidebarOpen(false);
    setDrawerOpen(false);
  };

  async function handleLogout() {
    setDrawerOpen(false);
    setSidebarOpen(false);
    await logout();
    navigate("/");
  }

  // Close drawer with outside click (desktop)
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

  // Close sidebar with outside click (mobile)
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

  // ✅ NEW: progressive haze while scrolling past hero (landing page only)
  useEffect(() => {
    const isLanding = location.pathname === "/";

    // Other pages: haze always visible
    if (!isLanding) {
      setFadeProgress(1);
      return;
    }

    let rafId = null;

    const update = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        setFadeProgress(0);
        return;
      }

      const rect = hero.getBoundingClientRect();
      const heroHeight = rect.height || 1;

      // How far hero moved up (0 when top aligned, increases as you scroll down)
      const scrolledPast = Math.max(0, -rect.top);

      // Fade becomes fully visible after you scroll this distance
      const fadeDistance = heroHeight * 0.6; // tweak: 0.4 faster, 0.8 slower

      const p = Math.min(1, scrolledPast / fadeDistance);
      setFadeProgress(p);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  // If user is administrator, open sidebar/drawer by default
  useEffect(() => {
    if (role === "adminr") {
      setSidebarOpen(true);
      setDrawerOpen(true);
    }
  }, [role]);

  // If current user is administrator, render a simplified navbar
  if (role === "admin") {
    return (
      <header className="fixed top-6 left-0 w-full z-50">
        {/* Progressive top haze BEHIND navbar */}
        <div
          className="pointer-events-none fixed top-0 left-0 w-full z-0"
          style={{ opacity: fadeProgress }}
        >
          <div className="h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_20%,rgba(255,255,255,0.85)_45%,rgba(255,255,255,0.6)_70%,rgba(255,255,255,0.25)_85%,rgba(255,255,255,0)_100%)] backdrop-blur-md" />
        </div>

        <div className="relative z-50 flex flex-col mx-6 lg:mx-10 xl:mx-24 2xl:mx-40">
          <nav
            className="flex h-12
                      justify-between 
                      items-center 
                      bg-gradient-to-r from-green-tolerated to-green-dark
                      rounded-full 
                      shadow
                      lg:h-16"
          >
            <Link className="ml-6 shrink-0 lg:ml-6" to="/">
              <img
                src={logo}
                alt="Logo"
                className="w-[140px] lg:w-[170px] xl:w-[170px] h-auto"
              />
            </Link>

            <div className="flex items-center gap-4 mr-6">
              <span className="text-white-intense font-nexa font-bold hidden sm:inline">Administrator</span>
              <img src={pdpph} alt="Admin" className="w-10 h-10 rounded-full object-cover" />
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-6 left-0 w-full z-50">
      {/* ✅ Progressive top haze BEHIND navbar */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-full z-0"
        style={{ opacity: fadeProgress }}
      >
        <div className="h-40 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.95)_20%,rgba(255,255,255,0.85)_45%,rgba(255,255,255,0.6)_70%,rgba(255,255,255,0.25)_85%,rgba(255,255,255,0)_100%)] backdrop-blur-md" />
      </div>

      {/* Navbar content ABOVE haze */}
      <div className="relative z-50 flex flex-col mx-6 lg:mx-10 xl:mx-24 2xl:mx-40">
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
                        setDrawerOpen(!drawerOpen);
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
                    setSidebarOpen(!sidebarOpen);
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
          className={`hidden lg:block absolute right-0 top-full mt-5 transition-all duration-200 ease-out
            ${
              isAuthenticated && drawerOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
        >
          <div className="bg-white-broken w-72 shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-3xl bg-white/95 backdrop-blur">
            <div className="flex flex-col items-center py-2">
              {role === "administrator" ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 text-left font-nexa text-xl text-green-dark hover:font-bold transition"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar drawer (mobile only) */}
        <div
          ref={sidebarRef}
          className={`lg:hidden absolute left-0 top-full w-full mt-5 transition-all duration-200 ease-out
            ${
              sidebarOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-2 pointer-events-none"
            }
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
                    to="/register"
                    onClick={() => setSidebarOpen(false)}
                    className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
                  >
                    Sign Up
                  </Link>
                </>
              ) : role === "administrator" ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-3 text-left font-nexa text-xl text-green-dark hover:font-bold transition"
                  >
                    Log Out
                  </button>
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
