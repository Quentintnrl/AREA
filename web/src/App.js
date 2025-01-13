import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/home";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/dashboard";
import Card from "./components/cards";
import Details from "./components/details";
import ConnectServices from "./components/connectServices";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/details">Details</Link>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/ConnectServices/:id" element={<ConnectServices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;