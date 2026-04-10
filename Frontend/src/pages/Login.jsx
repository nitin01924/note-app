import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }
      const data = { email, password };
      const res = await loginUser(data);

      localStorage.setItem("token", res.token);
      window.location.reload();
      navigate("/notes");

      console.log(res);
    } catch (error) {
      // error handling
      console.error(error);
    } finally {
      setLoading(false); //make state:false of setloading
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
        />

        <Button onClick={handleSubmit} loading={loading}>
          Login
        </Button>
      </div>
    </div>
  );
}

export default Login;
