import { NavLink } from "react-router-dom";
import {
  FiBox,
  FiLayers,
  FiGrid,
  FiLogOut,
  FiPackage,
  FiPlusCircle,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

function normalizeRoles(role) {
  const roles = Array.isArray(role) ? role : role ? [role] : [];
  return roles.map((item) => String(item).toLowerCase());
}

function getMenuByRole(role) {
  const normalizedRoles = normalizeRoles(role);
  const isAdmin =
    normalizedRoles.includes("admin") || normalizedRoles.includes("administrator");
  const isSeller = normalizedRoles.includes("seller");

  if (isAdmin) {
    return {
      title: "Admin Menu",
      homeLink: "/admin",
      subtitle: "GreenCycle admin panel",
      items: [
        { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
        { to: "/admin/users", label: "Users", icon: <FiUsers /> },
        { to: "/admin/products", label: "Products", icon: <FiBox /> },
        { to: "/admin/categories", label: "Categories", icon: <FiLayers /> },
        { to: "/admin/orders", label: "Orders", icon: <FiPackage /> },
      ],
    };
  }

  if (isSeller) {
    return {
      title: "Seller Menu",
      homeLink: "/seller",
      subtitle: "GreenCycle seller panel",
      items: [
        { to: "/seller", label: "Dashboard", icon: <FiGrid />, end: true },
        { to: "/seller/products", label: "Products", icon: <FiBox />, end: true },
        { to: "/seller/products/add", label: "Add Product", icon: <FiPlusCircle /> },
        { to: "/seller/orders", label: "Orders", icon: <FiPackage /> },
        { to: "/seller/profile", label: "Settings", icon: <FiSettings /> },
      ],
    };
  }

  return {
    title: "Client Menu",
    homeLink: "/client/profile/edit",
    subtitle: "GreenCycle client space",
    items: [
      { to: "/client/profile", label: "Edit Profile", icon: <FiSettings /> },
      { to: "/client/orders", label: "My Orders", icon: <FiPackage /> },
    ],
  };
}

export default function Sidebar({
  role,
  onLogout,
  mobileOpen = false,
  onCloseMobile = () => {},
}) {
  const menu = getMenuByRole(role);
  const normalizedRoles = normalizeRoles(role);
  const isSeller = normalizedRoles.includes("seller");

  return (
    <>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[70] bg-black/35 px-4 pt-24 flex items-start justify-center" onClick={onCloseMobile}>
          <section
            className="w-full max-w-[320px] max-h-[calc(100vh-7.5rem)] overflow-y-auto rounded-3xl bg-gradient-to-br from-green-tolerated to-green-dark p-4 shadow-[0_16px_30px_rgba(14,79,55,0.24)]"
            onClick={(event) => event.stopPropagation()}
          >
            <nav className="grid grid-cols-1 gap-2">
              {menu.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={Boolean(item.end)}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-all duration-300 ${
                      isActive
                        ? "bg-white-intense text-green-dark shadow-[0_8px_16px_rgba(0,0,0,0.14)]"
                        : "bg-white/8 text-green-light/95 hover:bg-white/16 hover:text-white-intense"
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {isSeller && (
              <NavLink
                to="/"
                onClick={onCloseMobile}
                className="mt-3 flex items-center justify-center rounded-full border border-white/60 px-4 py-2.5 text-sm font-semibold text-white-intense transition-all duration-300 hover:bg-white-intense hover:text-green-dark"
              >
                Switch To Buyer
              </NavLink>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="mt-3 w-full rounded-full border border-white/60 px-4 py-2.5 text-sm font-semibold text-white-intense transition-all duration-300 hover:bg-white-intense hover:text-green-dark"
            >
              <span className="inline-flex items-center gap-2">
                <FiLogOut />
                Logout
              </span>
            </button>
          </section>
        </div>
      )}

      <aside className="hidden md:flex md:w-72 md:shrink-0">
        <div className="sticky top-28 h-[calc(100vh-8.5rem)] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-green-tolerated to-green-dark p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_42px_rgba(14,79,55,0.25)]">
          <div className="flex h-full min-h-0 flex-col">
            <nav className="mt-6 flex-1 min-h-0 space-y-4 overflow-y-auto pr-1">
              {menu.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={Boolean(item.end)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-full px-4 py-3 text-[15px] transition-all duration-300 ${
                      isActive
                        ? "bg-white-intense text-green-dark shadow-[0_8px_18px_rgba(0,0,0,0.12)]"
                        : "text-green-light/90 hover:bg-white/12 hover:text-white-intense hover:translate-x-1 hover:shadow-[0_0_18px_rgba(151,255,210,0.18)]"
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={onLogout}
              className="mt-4 shrink-0 flex items-center justify-center gap-2 rounded-full border border-white/55 px-4 py-3 font-semibold text-white-intense transition-all duration-300 hover:bg-white-intense hover:text-green-dark hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)]"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
