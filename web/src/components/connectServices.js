import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";



function ConnectServices() {
  const { id } = useParams();
  const [serviceName, setServiceName] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);


  const checkLoginStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/isUserLogin/${id}/${userId}`);
      setIsConnected(response.data.login);
    } catch (error) {
      console.error('Error checking login status', error.response?.data);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getServices');
      for (const service of response.data) {
        if (String(service.id) === String(id)) {
            setServiceName(service.name);
        }
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const loginspotify = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/getServiceLoginURL/${userId}/${1}`);
      const url = response.data.url;
      console.log('Login URL:', url);
      window.open(url, '_blank');
      return url;
    } catch (error) {
      console.error('Login failed', error.response?.data);
    }
  };

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
    } else {
        async function checkLogin() {
            await checkLoginStatus();
        }
    }
  }, [isConnected]);

  fetchServices();

    return (
      <div>
        <h1>Connect Services</h1>
        <h1>{ serviceName}</h1>
        <div
        className={`toggle-button ${isConnected ? "connected" : ""}`}
        onClick={loginspotify}
        target="_blank"
        rel="noopener noreferrer"
        style={{
        background: `linear-gradient(to right, green ${animationProgress}%, #555 ${animationProgress}%)`,
        }}
        >
        <div className={`toggle-circle ${isConnected ? "active" : ""}`}></div>
        </div>
      </div>
    );

}

export default ConnectServices;
