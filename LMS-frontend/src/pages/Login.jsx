import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUser,  FaLock } from "react-icons/fa";


function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Form State
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Input Changes
  const handleChange = (e) => {
    // console.log("Sending:", form);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      console.log("Attempting login...");

      const res = await loginUser(form);

      console.log("LOGIN RESPONSE:", res.data);

      const access = res.data.access;
      const refresh = res.data.refresh;
      const user = res.data.user;

      if (!access || !refresh) {
        throw new Error("Authentication tokens were not returned.");
      }

      // Check role
      if (!user?.role) {
        setError(
          "Your account has not been assigned a role yet. Kindly contact the administrator."
        );

        return;
      }

      // Save authentication information
      login({
        access,
        refresh,
        user,
      });

      // Clear form
      setForm({
        username: "",
        password: "",
      });

      // Go to dashboard
      navigate("/");
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      console.log("STATUS:", err.response?.status);
      console.log("SERVER RESPONSE:", err.response?.data);

      const serverMessage =
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        err.response?.data?.message;

      setError(serverMessage || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-sidebar-background">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6">LMS LOGIN</h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex">
            <div className="bg-sidebar-primary px-4 flex items-center rounded-l-md text-white">
              <FaUser />
            </div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-sidebar-primary"
              required
            />
          </div>
          <div className="flex">
            <div className="bg-sidebar-primary px-4 flex items-center rounded-l-md text-white">
              <FaLock />
            </div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded p-3 text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-sidebar-primary hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="p-3 text">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-600 hover:text-blue-700"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
