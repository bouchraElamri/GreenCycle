import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import logo from "../../assets/Logo-white 2.png";
import searchicon from "../../assets/zoom.png";
import defaultProfileImage from "../../assets/pdpph.png";

export default function SellerNav() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [fadeProgress, setFadeProgress] = useState(0);
  const apiOrigin = (process.env.REACT_APP_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

  const progressiveHazeMask = {
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
  };

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

  const toggleRoleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-role-sidebar"));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const value = searchTerm.trim();
    const query = value ? `?name=${encodeURIComponent(value)}` : "";
    navigate(`/product_list${query}`);
  };

  const switchToBuyer = () => navigate("/");

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
          <Link className="ml-6 shrink-0 md:ml-6" to="/seller">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] md:w-[170px] xl:w-[170px] h-auto"
            />
          </Link>

          <div className="hidden md:flex md:items-center md:flex-1 md:justify-end">
            <ul className="flex items-center md:gap-6 xl:gap-12 mr-0">
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
                  onClick={switchToBuyer}
                  className="inline-flex items-center justify-center h-10 border  border-white-intense  text-white-intense text-lg font-nexa font-bold px-3 py-1 rounded-full transition-colors duration-300 hover:bg-white-intense hover:text-green-dark"
                >
                  Switch To Buyer
                </button>
              </li>

              <li>
                <button
                  type="button"
                  onClick={toggleRoleSidebar}
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
              onClick={toggleRoleSidebar}
              className="flex items-center mr-1 w-10 h-10 rounded-full overflow-hidden border-2 border-white-light md:hidden"
            >
              <img src={profileImageSrc} alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
