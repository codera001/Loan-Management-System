import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  HandCoins,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";

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
  return (
    <aside className="w-64 bg-sidebar-background text-white flex flex-col min-h-screen shadow-xl">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-3xl font-bold">LMS</h1>
        <p className="text-sm text-slate-400">
          Loan Management System
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.title}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                isActive
                  ? "bg-sidebar-primary"
                  : "hover:bg-slate-800"
              }`
            }
          >
            {item.icon}
            {item.title}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;