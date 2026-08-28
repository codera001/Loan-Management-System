import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HandCoins,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menu = [
  {
    title: "Dashboard",
    path: "/",
    icon: <LayoutDashboard size={20} />,
  },
  {
    title: "Customers",
    path: "/customers",
    icon: <Users size={20} />,
  },
  {
    title: "Loans",
    path: "/loans",
    icon: <HandCoins size={20} />,
  },
  {
    title: "Repayments",
    path: "/repayments",
    icon: <CreditCard size={20} />,
  },
  {
    title: "Reports",
    path: "/reports",
    icon: <BarChart3 size={20} />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings size={20} />,
  },
];

function Sidebar() {
  // Controls whether sidebar is open on mobile
  const [opensidebar, setOpensidebar] = useState(false);

  return (
    <>
      {/* =====================================
          MOBILE MENU BUTTON
      ===================================== */}

      <button
        onClick={() => setOpensidebar(true)}
        className="md:hidden fixed top-5 left-4 z-[70] bg-sidebar-background text-white p-2 rounded-lg shadow-lg items-center"
      >
        <Menu size={24} />
      </button>

      {/* =====================================
          MOBILE OVERLAY
      ===================================== */}

      {opensidebar && (
        <div
          onClick={() => setOpensidebar(false)}
          className="md:hidden fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`
          fixed
          top-0 left-0
          z-50
          w-64
          bg-sidebar-background
          text-white
          flex flex-col
          h-screen
          shadow-xl

          transform
          transition-transform
          duration-300

          ${
            opensidebar
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="p-6 border-b border-slate-700">

          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-3xl font-bold">
                LMS
              </h1>

              <p className="text-sm text-slate-400">
                Loan Management System
              </p>
            </div>

            {/* Mobile close button */}

            <button
              onClick={() => setOpensidebar(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>

          </div>

        </div>

        {/* =====================================
            NAVIGATION
        ===================================== */}

        <nav className="flex-1 px-3 py-5 space-y-2   overflow-y-auto">

          {menu.map((item) => (

            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/"}

              onClick={() => setOpensidebar(false)}

              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  isActive
                    ? "bg-sidebar-primary"
                    : "hover:bg-slate-800"
                }`
              }
            >

              {item.icon}

              <span>
                {item.title}
              </span>

            </NavLink>

          ))}

        </nav>

      </aside>
    </>
  );
}

export default Sidebar;

