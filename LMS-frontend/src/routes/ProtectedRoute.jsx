import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute() {
  const { user, loading } = useContext(AuthContext);

  console.log("ProtectedRoute:", {
    user,
    loading,
  });

  // Wait for authentication check to finish
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // User isn't authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated
  return <Outlet />;
}

export default ProtectedRoute;