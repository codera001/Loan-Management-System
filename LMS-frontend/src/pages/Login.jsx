import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    console.log("Sending:", form);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
      
    }));
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting Login Form...");
    console.log("Form Data:", form);
    setLoading(true);
    setError("");

    try {
      console.log("About to call API...");

      const res = await loginUser(form);
      
      console.log("API Success");
      console.log(res.data);
      // Support both JWT formats
      const token = res.data.access || res.data.token;

      if (!token) {
        throw new Error("No authentication token returned.");
      }

      login({
        access: res.data.access,
      });
      // Clear the form
      setForm({
        username: "",
        password: "",
      });

      navigate("/");
    } catch (err) {
      console.log("========== LOGIN FAILED ==========");
      console.log("Error:", err);
    
      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);
      } else if (err.request) {
        console.log("No response received");
        console.log(err.request);
      } else {
        console.log(err.message);
      }
    
      setError(
        err.response?.data?.detail ||
        "Invalid username or password."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">

        <h2 className="text-3xl font-bold text-center mb-6">
          Login
        </h2>

        {error && (
          <div className="mb-4 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded p-3 text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>
        <p>
  Don't have an account?{" "}
  <span onClick={() => navigate("/register")}>
    Register
  </span>
</p>
      </div>
    </div>
  );
}

export default Login;