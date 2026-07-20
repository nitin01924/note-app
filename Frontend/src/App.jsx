import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Notes from "./pages/Notes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import { Analytics } from "@vercel/analytics/react";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

//
//  FUNCTION - APP
function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    checkAuth();
  }, [token]);

  const handleAuthSuccess = (nextToken) => {
    localStorage.setItem("token", nextToken);
    setToken(nextToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-panel rounded-lg p-6 text-center">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      {token && (
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onLogout={handleLogout}
          user={user}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            token ? (
              <Navigate to="/notes" />
            ) : (
              <Login onAuthSuccess={handleAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={<Register onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/notes"
          element={token ? <Notes /> : <Navigate to="/" />}
        />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Analytics />
    </div>
  );
}

export default App;
