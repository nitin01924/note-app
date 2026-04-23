import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const token = searchParams.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return toast.error("Please enter new password");
    }

    try {
      setLoading(true);

      const res = await apiRequest(`/auth/reset-password?token=${token}`, {
        method: "POST",
        body: JSON.stringify({ password }),
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
        <h2 className="text-xl font-bold text-center">Reset Password</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Enter new password"
            className="p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white py-2 rounded-md"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
