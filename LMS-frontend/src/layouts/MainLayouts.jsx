import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="flex bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;