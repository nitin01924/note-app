import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-3 shadow">
      <h1 className="font-bold">Notes</h1>
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        Logout
      </Button>
    </div>
  );
}

export default Navbar;
