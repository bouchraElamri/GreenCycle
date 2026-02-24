import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Logo-white 2.png";
import pdpph from "../../assets/pdpph.png";

export default function AdminNav() {
  const [fadeProgress, setFadeProgress] = useState(0);

  const progressiveHazeMask = {
    WebkitMaskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
    maskImage:
      "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.35) 75%, rgba(0,0,0,0) 100%)",
  };

  useEffect(() => {
    setFadeProgress(1);
  }, []);

  const toggleRoleSidebar = () => {
    window.dispatchEvent(new CustomEvent("toggle-role-sidebar"));
  };

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

      <div className="relative z-50 flex flex-col mx-6 lg:mx-10 xl:mx-24 2xl:mx-40">
        <nav
          className="flex h-12 justify-between items-center bg-gradient-to-r from-green-tolerated to-green-dark rounded-full shadow lg:h-16"
        >
          <Link className="ml-6 shrink-0 lg:ml-6" to="/admin">
            <img
              src={logo}
              alt="Logo"
              className="w-[140px] lg:w-[170px] xl:w-[170px] h-auto"
            />
          </Link>

          <div className="flex items-center gap-4 mr-1 md:mr-3">
            <span className="text-white-intense font-nexa font-bold hidden sm:inline">
              Administrator
            </span>
            <button
              type="button"
              onClick={toggleRoleSidebar}
              className="flex items-center w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white-light"
            >
              <img src={pdpph} alt="Admin" className="w-full h-full object-cover" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
