import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { LogOut, Moon, NotebookPen, Sun } from "lucide-react";

function Navbar({ darkMode, setDarkMode, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/82 px-4 py-3 text-slate-950 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/82 dark:text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate("/notes")}
          className="focus-ring flex items-center gap-3 rounded-lg"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-600 text-white shadow-sm shadow-cyan-600/20">
            <NotebookPen size={21} />
          </span>
          <span className="text-left">
            <span className="block text-base font-bold leading-tight">
              Notes
            </span>
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Keep every thought close
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => setDarkMode(!darkMode)}
            icon={darkMode ? Sun : Moon}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="hidden sm:inline">
              {darkMode ? "Light" : "Dark"}
            </span>
          </Button>

          <Button
            variant="danger"
            icon={LogOut}
            onClick={() => {
              onLogout();
              navigate("/");
            }}
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
