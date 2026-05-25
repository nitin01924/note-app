import { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      const res = await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      toast.success(res.message);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen transition-all duration-300 ${
        darkMode ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Floating Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-5 right-5 p-3 rounded-full shadow-lg transition-all duration-300 ${
          darkMode
            ? "bg-zinc-800 hover:bg-zinc-700"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Card */}
      <div
        className={`w-80 p-6 rounded-2xl shadow-2xl flex flex-col gap-4 border transition-all duration-300 ${
          darkMode ? "bg-zinc-900 border-zinc-800" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        <p
          className={`text-sm text-center ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className={`p-3 rounded-lg outline-none border transition-all duration-300 ${
              darkMode
                ? "bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                : "bg-white border-gray-300 text-black"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-all duration-300 font-medium"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          onClick={() => navigate("/")}
          className={`text-sm text-center cursor-pointer transition-all duration-300 ${
            darkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-600 hover:text-black"
          }`}
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
