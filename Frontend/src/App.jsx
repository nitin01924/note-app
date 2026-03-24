import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Notes from "./pages/Notes.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/notes" /> : <Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/notes"
        element={
          <ProtectedRoutes>
            {" "}
            <Notes />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
}

export default App;
