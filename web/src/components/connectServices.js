import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';



function ConnectServices() {
  const navigate = useNavigate();
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
      const popup = window.open(
        url,
        'Login Service',
        'width=500,height=600,left=400,top=100'
      );
      const checkPopup = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopup);
          checkLoginStatus(); // Check if login was successful
          setAnimationProgress(0); // Reset animation
        }
      }, 1000);
  
      return url;
      // window.open(url, '_blank');
      // return url;
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
        {isConnected && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Back to Dashboard
          </button>
        )}
      </div>
      
    );

}

export default ConnectServices;
