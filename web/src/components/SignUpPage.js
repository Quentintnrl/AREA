/*
** EPITECH PROJECT, 2024
** AREA
** File description:
** login.page
*/
import React, { useState } from "react";
import "./SignUpPage.css";
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/register', {
        userEmail: email,
        userName: userName,
        password: password
      });

      console.log(response);
      
      // Store token in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.Id);
      localStorage.setItem('userName', response.data.userName);
      
      // Redirect to home page
      navigate('/dashboard');
      console.log('Registration successful', response.data);
    } catch (error) {
      // Handle registration error
      setError(error.response?.data?.error || 'Registration failed');
      console.error('Registration failed', error.response?.data);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">AREA</h1>
      <h2 className="signup-subtitle">Sign up</h2>
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          className="signup-input"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="signup-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
      Already on AREA? <Link to="/login">Log in here.</Link>
      </p>
    </div>
  );
};

export default SignUpPage;