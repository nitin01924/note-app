import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-3 shadow bg-white dark:bg-gray-800 text-black dark:text-white">
      <h1 className="font-bold">Notes</h1>

      <div className="flex gap-3">
        <Button
          variant="danger"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          Logout
        </Button>

        <Button variant="secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light" : "Dark"}
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
