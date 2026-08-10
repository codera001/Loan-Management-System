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

  const handleChange = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser(form);

      // adjust based on backend response
      const token = res.data.access || res.data.token;

      // auto-login after register (optional but recommended)
      if (token) {
        login({
          access: token,
          user: res.data.user, 
        });
        navigate("/");
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };
   return(

     <div className="min-h-screen bg-cyan-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-emerald-300 rounded-lg shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-white mb-8">
          REGISTER ACCOUNT
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="flex">
            <div className="bg-amber-400 px-4 flex items-center rounded-l-md text-white">
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
            <div className="bg-amber-400 px-4 flex items-center rounded-l-md text-white">
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
            <div className="bg-amber-400 px-4 flex items-center rounded-l-md text-white">
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
            <div className="bg-amber-400 px-4 flex items-center rounded-l-md text-white">
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
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-md font-semibold transition"
          >
            Register Account
          </button>
        </form>

        <p className="text-sm mt-3 text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
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