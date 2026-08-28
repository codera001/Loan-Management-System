import { useState, useEffect, useContext } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect page scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
  
    window.addEventListener("scroll", handleScroll);
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`
        fixed
        top-0
        right-0
        z-50
        h-20
        px-6
        flex
        items-center
        justify-between
        shadow
        transition-all
        duration-300

        left-0
        md:left-64

        ${
          scrolled
            ? "bg-sidebar-background text-white"
            : "bg-white text-gray-900"
        }
      `}
    >
      {/* =========================
          TITLE
      ========================= */}

      <h2 className="hidden md:block text-2xl font-semibold">
        Loan Management System
      </h2>

      {/* =========================
          RIGHT SIDE
      ========================= */}

      <div className="flex items-center gap-5 ml-auto">

        {/* NOTIFICATION */}

        <button className="relative">
          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full">
          </span>
        </button>

        {/* USER */}

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          {/* PROFILE IMAGE */}

          <img
            src="https://github.com/mdo.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />

          {/* USER INFORMATION */}

          <div className="hidden sm:block text-left">
            <div className="font-semibold">
              {user?.username || "User"}
            </div>

            <div
              className={`text-xs ${
                scrolled
                  ? "text-slate-300"
                  : "text-gray-500"
              }`}
            >
              {user?.role || "No role assigned"}
            </div>
          </div>

          <ChevronDown size={18} />
        </button>

        {/* =========================
            DROPDOWN
        ========================= */}

        {open && (
          <div
            className="
              absolute
              right-5
              top-16
              w-56
              bg-white
              text-gray-900
              rounded-xl
              shadow-xl
              overflow-hidden
            "
          >

            {/* PROFILE */}

            <NavLink
              to="/profile"
              onClick={() => setOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-gray-100
              "
            >
              <User size={18} />
              Profile
            </NavLink>

            {/* SETTINGS */}

            <NavLink
              to="/settings"
              onClick={() => setOpen(false)}
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                hover:bg-gray-100
              "
            >
              <Settings size={18} />
              Settings
            </NavLink>

            {/* LOGOUT */}

            <button
              onClick={logout}
              className="
                w-full
                flex
                items-center
                gap-3
                px-4
                py-3
                text-red-600
                hover:bg-red-50
              "
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;