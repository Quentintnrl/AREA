/*
** EPITECH PROJECT, 2024
** AREA
** File description:
** navbar
*/

import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo.svg" alt="AREA" />
      </div>
      <ul className="nav-links">
        <li>
          <button className="nav-btn" onClick={() => navigate("/explore")}>
            Explore
          </button>
        </li>
        <li>
          <button className="nav-btn" onClick={() => navigate("/solutions")}>
            Solutions
          </button>
        </li>
        <li>
          <button className="nav-btn" onClick={() => navigate("/plans")}>
            Plans
          </button>
        </li>
        <li>
          <button className="nav-btn" onClick={() => navigate("/signup")}>
            Log in
          </button>
        </li>
        <li>
          <button className="btn-get-started">
            Get Started
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
