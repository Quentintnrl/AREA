import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/home";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
            </li>
          </ul>
        </nav>

        {/* Définition des routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function LogInButton() {
  const navigate = useNavigate();

  return (
    <button
      className="nav-btn"
      onClick={() => {
        navigate("/signup");
      }}
    >
      Log in
    </button>
  );
}

export default App;
