import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Notes from "./pages/Notes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar.jsx";

//  FUNCTION - APP
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch("http://localhost:3000/api/auth/me", {
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

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
      {user && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route path="/" element={user ? <Navigate to="/notes" /> : <Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={user ? <Notes /> : <Navigate to="/" />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default App;
