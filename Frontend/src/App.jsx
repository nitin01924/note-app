import Notes from "./pages/Notes.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { useState } from "react";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  const token = localStorage.getItem("token");

  //  If logged in → show Notes
  if (token) {
    return <Notes />;
  }

  //  If not logged in → show Login/Register
  return (
    <div>
      {isLogin ? <Login /> : <Register />}

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Go to Register" : "Go to Login"}
      </button>
    </div>
  );
}

export default App;
