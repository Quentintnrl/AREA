import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./details.css";
import axios from "axios";

function Details() {
  const [isConnected, setIsConnected] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const { id } = useParams();
  const location = useLocation();
  const card = location.state?.card;

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setAnimationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5; // Animation progression
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isConnected]);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const loginspotify = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/getServiceLoginURL/${userId}/${1}`)
      const url = response.data.url;
      console.log('Login URL:', url);
      // window.location(url)
      window.location.replace(url)
      return url;
    } catch (error) {
      console.error('Login failed', error.response?.data);
    }
  }

  return (
    <div className="details">
      <h1>{card?.title || `Details for Card ${id}`}</h1>
      <p>{card?.details || "No additional details available."}</p>
      <div
        className={`toggle-button ${isConnected ? "connected" : ""}`}
        onClick={loginspotify}
        style={{
          background: `linear-gradient(to right, green ${animationProgress}%, #555 ${animationProgress}%)`,
        }}
      >
        <div className={`toggle-circle ${isConnected ? "active" : ""}`}></div>
      </div>
    </div>
  );
}

export default Details;