import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Notes from "./pages/Notes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";
import { Analytics } from "@vercel/analytics/react";

//  FUNCTION - APP
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  const token = localStorage.getItem("token");

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      {token && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route
          path="/"
          element={token ? <Navigate to="/notes" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/notes"
          element={token ? <Notes /> : <Navigate to="/" />}
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
      <Analytics />
    </div>
  );
}

export default App;
