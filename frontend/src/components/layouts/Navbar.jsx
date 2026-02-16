import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import logo from "../../assets/Logo-white 2.png";
import searchicon from "../../assets/zoom.png";
import profile from "../../assets/profile.jpg";
import { useRef } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);

  const drawerRef = useRef(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const goToLogin = () => {
    navigate(`/login`);
  };
  const gotosignup = () => {
    navigate(`/register`);
  };
  const switchtoseller = () => {
    navigate("/seller");
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


  return (
    <>
      <div className="flex flex-col mx-40">
        <nav
          className="h-16 flex 
    justify-between 
    items-center 
    px-6 py-4 mt-6 
    bg-gradient-to-r from-green-tolerated to-green-dark
    rounded-full 
    shadow"
        >
          <Link to="/">
            <img src={logo} alt="Logo" width={120} />
          </Link>
          <ul className="flex items-center gap-20">
            <li>
              <Link
                to="/products"
                className="font-nexa font-bold text-lg p-full text-white-intense  hover:bg-white-intense hover:px-3 hover:py-1 hover:rounded-full hover:text-green-dark"
              >
                Products
              </Link>
            </li>
            <li className="flex bg-white-intense rounded-full overflow-hidden w-96">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full mx-5 py-2 rounded-full outline-none text-grayCustom placeholder:text-grayCustom/50"
              />
              <button className="px-4 py-2 transition">
                <img src={searchicon} alt="Search" className="w-7 h-5" />
              </button>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <button
                    onClick={goToLogin}
                    className="font-nexa font-bold text-lg text-white-intense px-3 py-1 rounded"
                  >
                    Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={gotosignup}
                    className="font-nexa font-bold text-lg text-white-intense px-3 py-1 rounded"
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
                    className="text-white-intense text-lg font-nexa font-bold"
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
                    className="flex item-center m-0 w-12 h-12 rounded-full overflow-hidden border-2 border-white-light"
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
        </nav>
        {/* Right sidebar drawer */}
        {drawerOpen && (
        <div ref={drawerRef} className="flex justify-between mt-5">
          <div></div>
          <div className="bg-white-broken w-72  shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-3xl opacity-90">
              <div className="flex flex-col items-center">
                <Link
                  to="/profile"
                  className="pr-44 pt-3 pb-3 font-nexa text-xl p-full text-gray "
                >
                  Profile
                </Link>
                <div className="rounded-full  w-64 h-0.5 opacity-10 bg-gray"></div>
                <button
                  onClick={handleLogout}
                  className="pr-40 pt-3 pb-3 font-nexa text-xl text-green-dark"
                >
                  Log Out
                </button>
              </div>
          </div>
        </div>
        )}
      </div>
    </>
  );
}
