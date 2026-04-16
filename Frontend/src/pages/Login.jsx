import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { toast } from "react-toastify";

function Login({ onAuthSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);

      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      const data = { email, password };
      const res = await loginUser(data);

      onAuthSuccess(res.token);
      navigate("/notes");
    } catch (error) {
      const message = error.message || "Unable to login";
      toast.error(message);

      if (message.toLowerCase().includes("register")) {
        setTimeout(() => {
          navigate("/register");
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 p-6 shadow-lg rounded-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Login</h2>

        <Input
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showToggle
        />

        <Button onClick={handleSubmit} loading={loading}>
          Login
        </Button>
        <p onClick={() => navigate("/register")}>
          Don't have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;
