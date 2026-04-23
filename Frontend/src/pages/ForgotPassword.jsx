import { useState } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 p-6 shadow-lg rounded-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Forgot Password</h2>

        <p className="text-sm text-gray-500 text-center">
          Enter your email to receive a reset link
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-md"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p
          onClick={() => navigate("/")}
          className="text-sm text-center cursor-pointer"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
