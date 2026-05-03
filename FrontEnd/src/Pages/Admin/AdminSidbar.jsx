import React from "react";
import {
  LayoutDashboard,
  Package,
  Grid,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  TrendingUp,
  Mail,
  Store,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Categories", icon: Grid, path: "/admin/categories" },
  { name: "Customers", icon: Users, path: "/admin/customers" },
  // { name: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { name: "Messages", icon: Mail, path: "/admin/messages" },
  { name: "Store", icon: Store, path: "/" },
];

const AdminSidbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-72 h-screen bg-[#050F2A] flex flex-col border-r border-white/5 sticky top-0 overflow-y-auto">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#A78BFA] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(167,139,250,0.3)]">
            <span className="text-white font-black text-xl italic">R</span>
          </div>
          <div>
            <h1 className="text-white font-black text-xl tracking-tight">
              RENTLY <span className="text-[#A78BFA]">PRO</span>
            </h1>
            <p className="text-gray-500 text-[10px] font-bold tracking-widest uppercase">
              Management Suite
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
              ${
                isActive
                  ? "bg-[#A78BFA] text-white shadow-[0_10px_20px_-5px_rgba(167,139,250,0.3)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className="shrink-0" />
              <span className="font-semibold text-[15px]">{item.name}</span>
            </div>
            <ChevronRight
              size={14}
              className={`transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1`}
            />
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto">
        <div className="bg-white/5 rounded-[24px] p-4 border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A78BFA] to-white/20 p-px">
              <img
                src={user.profile_image || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
                alt="Admin"
                className="w-full h-full rounded-full bg-[#050F2A] object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {user.Firstname && user.LastName ? `${user.Firstname} ${user.LastName}` : "Admin User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.Email || "admin@rently.com"}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 font-bold text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidbar;
