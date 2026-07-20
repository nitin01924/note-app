import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { LogOut, Moon, NotebookPen, Sun } from "lucide-react";

function Navbar({ darkMode, setDarkMode, onLogout, user }) {
  const navigate = useNavigate();
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const initial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };

    document.addEventListener("pointerdown", closeProfileMenu);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeProfileMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const logout = () => {
    setProfileOpen(false);
    onLogout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/95 px-4 py-3 text-slate-950 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:px-6">
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
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="h-10 w-10 px-0 sm:h-auto sm:w-auto sm:px-4"
          >
            <span className="hidden sm:inline">
              {darkMode ? "Light" : "Dark"}
            </span>
          </Button>

          <Button
            variant="danger"
            icon={LogOut}
            onClick={logout}
            className="hidden sm:inline-flex"
          >
            Logout
          </Button>

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((open) => !open)}
              className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-600 font-bold text-white transition hover:ring-2 hover:ring-cyan-300"
              title={user?.name || "User"}
              aria-label="Open profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
            >
              {user?.avatar && !avatarFailed ? (
                <img
                  src={user.avatar}
                  alt={`${user.name}'s profile`}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                />
              ) : (
                initial
              )}
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-12 z-30 w-64 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-2 text-white shadow-xl shadow-black/30"
              >
                <div className="border-b border-slate-800 px-3 py-2.5">
                  <p className="truncate text-sm font-bold">
                    {user?.name || "User"}
                  </p>
                  {user?.email && (
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  className="focus-ring mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-rose-400 transition hover:bg-rose-950/40"
                >
                  <LogOut size={17} aria-hidden="true" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
