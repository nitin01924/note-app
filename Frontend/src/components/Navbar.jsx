import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Navbar({ darkMode, setDarkMode, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-6 py-3 round border border-gray-700 shadow bg-white dark:bg-gray-950 text-black dark:text-white">
      <h1 className="font-bold">Notes</h1>

      <div className="flex gap-3">
        <Button
          variant="danger"
          onClick={() => {
            onLogout();
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
