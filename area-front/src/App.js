import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";
import HomePage from "./components/home";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/dashboard";
import Card from "./components/cards";
import Details from "./components/details";

function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/details/:id" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;