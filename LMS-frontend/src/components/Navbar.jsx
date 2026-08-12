import { useState } from "react";
import { Bell, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function Navbar() {
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };
// const user = JSON.parse(localStorage.getItem("user"));

  const {user} = useContext(AuthContext);

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4 relative">

      <h2 className="text-2xl font-semibold">
        Loan Management System
      </h2>

      <div className="flex items-center gap-5">

        <button className="relative">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3"
        >
          <img
            src="https://github.com/mdo.png"
            alt=""
            className="w-10 h-10 rounded-full"
          />

          <div className="text-left">
            <div className="font-semibold">
              {user.username}
            </div>

            <div className="text-xs text-gray-500">
              {user.role}
            </div>
          </div>

          <ChevronDown size={18} />
        </button>

        {open && (
          <div className="absolute right-5 top-20 w-56 bg-white rounded-xl shadow-xl overflow-hidden">

            <NavLink
              to="/profile"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <User size={18} />
              Profile
            </NavLink>

            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
            >
              <Settings size={18} />
              Settings
            </NavLink>

            <button
onClick={logout}
className="bg-red-600 text-white px-3 py-2 rounded"
>
Logout
</button>

          </div>
        )}

      </div>
    </header>
  );
}

export default Navbar;