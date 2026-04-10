import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!name || !email || !password) {
        alert("Please fill all fields");
        return;
      }
      const data = { name, email, password };
      const res = await registerUser(data);

      // storing the token in localstorage when user register (signup)
      localStorage.setItem("token", res.token);
      navigate("/notes");

      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-80 p-6 shadow-lg rounded-lg flex flex-col gap-4">
        <h2 className="text-xl font-bold text-center">Register</h2>

        <Input
          label="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          Register
        </Button>
         <p onClick={() => navigate("/")}>Already have an account? Login</p>
      </div>
    </div>

  );
}
export default Register;
