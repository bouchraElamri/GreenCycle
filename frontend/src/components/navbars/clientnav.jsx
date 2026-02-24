import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMenuSearchFill } from "react-icons/ri";
import AuthContext from "../../contexts/AuthContext";
import logo from "../../assets/Logo-white 2.png";
import searchicon from "../../assets/zoom.png";
import defaultProfileImage from "../../assets/pdpph.png";

export default function ClientNav() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);

  const drawerRef = useRef(null);
  const sidebarRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fadeProgress, setFadeProgress] = useState(0);
  const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  const progressiveHazeMask = {
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
  };

  const switchToSeller = () => navigate("/seller");

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
    return () => document.removeEventListener("mousedown", handleClickOutsidebox);
  }, [sidebarOpen]);

  useEffect(() => {
    setFadeProgress(1);
  }, []);

  const resolveProfileImage = (rawPath) => {
    if (!rawPath) return defaultProfileImage;

    const normalized = String(rawPath).replace(/\\/g, "/");
    if (normalized.startsWith("http")) return normalized;

    const uploadsIndex = normalized.indexOf("/uploads/");
    if (uploadsIndex >= 0) return `${apiOrigin}${normalized.slice(uploadsIndex)}`;
    if (normalized.startsWith("uploads/")) return `${apiOrigin}/${normalized}`;

    return `${apiOrigin}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
  };

  const profileImageSrc = resolveProfileImage(user?.profileImage);

  return (
    <header className="fixed top-6 left-0 w-full z-50">
      <div
        className="pointer-events-none fixed top-0 left-0 w-full z-0"
        style={{ opacity: fadeProgress }}
      >
        <div
          className="h-20 md:h-24 bg-white backdrop-blur-xl"
          style={progressiveHazeMask}
        />
      </div>

      <div className="relative z-50 flex flex-col mx-6 md:mx-24">
        <nav className="flex h-12 justify-between items-center bg-gradient-to-r from-green-tolerated to-green-dark rounded-full shadow md:h-16">
          <Link className="ml-6 shrink-0 md:ml-6" to="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] md:w-[170px] xl:w-[170px] h-auto"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:flex-1 md:justify-end">
            <ul className="flex items-center md:gap-6 xl:gap-12 mr-0">
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
                  className="flex h-10 bg-white-intense rounded-full overflow-hidden md:w-64 xl:w-96"
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

              <li>
                <button
                  onClick={switchToSeller}
                  className="inline-flex items-center justify-center h-10 text-white-intense text-lg font-nexa font-bold px-3 py-1 rounded-full transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                >
                  Switch To Seller
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                  className="flex item-center mr-3 w-12 h-12 rounded-full overflow-hidden border-2 border-white-light"
                >
                  <img
                    src={profileImageSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              </li>
            </ul>
          </div>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center mr-1 w-10 h-10 rounded-full overflow-hidden border-2 border-white-light md:hidden"
            >
              <img src={profileImageSrc} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </nav>

        <div
          ref={drawerRef}
          className={`hidden md:block absolute right-0 top-full mt-5 transition-all duration-200 ease-out ${
            drawerOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
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
                to="/client/edit-profile"
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

        <div
          ref={sidebarRef}
          className={`md:hidden absolute left-0 top-full w-full mt-5 transition-all duration-200 ease-out ${
            sidebarOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="bg-white-broken w-full shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-3xl bg-white/95 backdrop-blur">
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
                  className="flex h-10 bg-white-intense rounded-full overflow-hidden md:w-64 xl:w-96"
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

              <div className="w-[85%] h-px bg-black/10" />

              <Link
                to="/cart"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Cart
              </Link>

              <div className="w-[85%] h-px bg-black/10" />

              <Link
                to="/seller"
                onClick={() => setSidebarOpen(false)}
                className="px-6 py-3 font-nexa text-xl text-gray hover:font-bold transition"
              >
                Switch To Seller
              </Link>

              <div className="w-[85%] h-px bg-black/10" />

              <Link
                to="/client/edit-profile"
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
