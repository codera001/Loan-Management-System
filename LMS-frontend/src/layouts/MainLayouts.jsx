import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <div className="flex  min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">

       
        <Navbar /> 
       

        <main className="p-6  pt-24 md:pt-25 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;