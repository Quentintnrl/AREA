import React, { useState } from "react";
import "./SignUpPage.css"; // Utilisez le même fichier CSS que SignUpPage
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        userName: email,
        password: password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.Id);
      localStorage.setItem('userName', response.data.userName);

      console.log('Login successful', response.data);
      navigate('/dashboard');
    } catch (error) {
      // Handle login error
      setError(error.response?.data?.error || 'Login failed');
      console.error('Login failed', error.response?.data);
    }
  };

  const handleLoginSuccess = async (response) => {
    console.log('Google login successful');
    const token = response.credential;  // Get the ID token from Google

    console.log('Google ID Token:', token);
    try {
      // Send the token to the backend to verify
      const res = await axios.post('http://localhost:8080/auth/google', { token: token });

      // Handle the response, store the JWT token, etc.
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user[0].id);
      localStorage.setItem('userName', res.data.user[0].username); // Save the token in local storage
      console.log('User ID:', localStorage.getItem('userId'));
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication failed:', err);
    }
  };

  const handleLoginFailure = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">AREA</h1>
      <h2 className="signup-subtitle">Log in</h2>
      {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}

      <form className="signup-form" onSubmit={handleSubmit}>
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
          Log in
        </button>
      </form>

      <p className="signup-divider">or</p>

      <div className="social-buttons">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginFailure}
        />
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
        New to AREA? <Link to="/signup">Sign up here.</Link>
      </p>
    </div>
  );
};

export default LoginPage;