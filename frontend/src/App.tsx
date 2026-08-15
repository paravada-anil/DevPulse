import { useState } from "react";
import "./App.css";
import Login from "./login";
import Signup from "./signup";
import Dashboard from "./Dashboard";

function App() {
  const [page, setPage] = useState("login");

  const handleLoginSuccess = () => {
    setPage("dashboard");
  };

  const token = localStorage.getItem("token");

  // User already logged in
  if (token && page === "login") {
    return <Dashboard />;
  }

  // Dashboard
  if (page === "dashboard") {
    return <Dashboard />;
  }

  return (
    <div>
      {page === "login" ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Signup />
      )}

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        {page === "login" ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setPage("signup")}>
              Create Account
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setPage("login")}>
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

export default App;