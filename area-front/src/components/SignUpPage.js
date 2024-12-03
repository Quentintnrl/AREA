/*
** EPITECH PROJECT, 2024
** AREA
** File description:
** login.page
*/

import React from "react";
import "./SignUpPage.css";
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';

const SignUpPage = () => {
  return (
    <div className="signup-container">
      <h1 className="signup-title">AREA</h1>
      <h2 className="signup-subtitle">Sign up</h2>
      <form className="signup-form">
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
        />
        <button type="submit" className="signup-button primary">
          Get started
        </button>
      </form>
      <p className="signup-divider">or</p>
      <div className="social-buttons">
        <button className="signup-button google">
          <FaGoogle className="mr-2" />
          Continue with Google
        </button>
        <button className="signup-button apple">
          <FaApple className="mr-2" />
          Continue with Apple
        </button>
        <button className="signup-button facebook">
          <FaFacebookF className="mr-2" />
          Continue with Facebook
        </button>
      </div>
      <p className="signup-footer">
        Already on AREA? <a href="/login">Log in here.</a>
      </p>
    </div>
  );
};

export default SignUpPage;