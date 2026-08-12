import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { registerUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";


function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
  
  const [ form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    console.log("========== REGISTRATION ==========");
    console.log("Sending registration data:", {
      username: form.username,
      email: form.email,
      // Don't log passwords
    });

    try {
      const res = await registerUser(form);

      console.log("Registration successful!");
      console.log("Server response:", res.data);

      // Registration successful
      alert("Registration successful. Please login.");

      // Go to login page
      navigate("/login");

    } catch (err) {
      console.error("========== REGISTRATION FAILED ==========");
      console.error("Error:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Response:", err.response.data);

        // Show Django validation error
        const data = err.response.data;

        if (data.username) {
          setError(data.username[0]);
        } else if (data.email) {
          setError(data.email[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.confirm_password) {
          setError(data.confirm_password[0]);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Registration failed. Please check your information.");
        }

      } else if (err.request) {
        console.error("No response received from server.");
        setError("Could not connect to the server.");

      } else {
        console.error("Error:", err.message);
        setError("Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  };
   return(

     <div className="min-h-screen bg-sidebar-background flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
         LMS  REGISTER ACCOUNT
        </h2>
          {/* Error message */}
        {error && (
          <div className="mb-5 rounded bg-red-100 border border-red-400 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
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
              className="w-full p-3 rounded-r-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="flex">
            <div className="bg-sidebar-primary px-4 flex items-center rounded-l-md text-white">
              <FaEnvelope />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-r-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
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
              className="w-full p-3 rounded-r-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex">
            <div className="bg-sidebar-primary px-4 flex items-center rounded-l-md text-white">
              <FaLock />
            </div>

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              value={form.confirm_password}
              onChange={handleChange}
              className="w-full p-3 rounded-r-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {loading ? "Registering new user..." : "Register"}
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-red-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
  
  
  export default Register;