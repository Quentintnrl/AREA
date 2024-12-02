/*
** EPITECH PROJECT, 2024
** AREA
** File description:
** login.page
*/
import React from "react";
import "./SignUpPage.css";

const SignUpPage = () => {
  return (
    <div className="signup-container">
      <h1 className="signup-title">IFTTT</h1>
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
        <button className="signup-button google">Continuer avec Google</button>
        <button className="signup-button apple">Continue with Apple</button>
        <button className="signup-button facebook">Continue with Facebook</button>
      </div>
      <p className="signup-footer">
        Already on IFTTT? <a href="/login">Log in here.</a>
      </p>
    </div>
  );
};

export default SignUpPage;
