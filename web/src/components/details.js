import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./details.css";
import axios from "axios";

function Details() {
  const [isConnected, setIsConnected] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const { actionId } = useParams();
  const location = useLocation();
  const card = location.state?.card;

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`http://localhost:8080/isUserLogin/${1}/${userId}`);
        setIsConnected(response.data.login);
      } catch (error) {
        console.error('Error checking login status', error.response?.data);
      }
    };

    checkLoginStatus();
  }, []);

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

  const loginspotify = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`http://localhost:8080/getServiceLoginURL/${userId}/${1}`);
      const url = response.data.url;
      console.log('Login URL:', url);
      window.location.replace(url);
    } catch (error) {
      console.error('Login failed', error.response?.data);
    }
  };

  const createAREA = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`http://localhost:8080/createAREA/${userId}`, {
        serviceId: 1,
        action: "createPlaylist",
        reaction: "addSongToPlaylist",
        actionParams: {
          playlistName: "My Playlist"
        },
        reactionParams: {
          songName: "My Song"
        }
      });
      console.log('AREA created:', response.data);
    } catch (error) {
      console.error('AREA creation failed', error.response?.data);
    };
  };

  return (
    <div className="details">
      <h1>{card?.title || `Details for Card ${actionId}`}</h1>
      <p>{card?.details || "No additional details available."}</p>
      {!isConnected ? (
        <div
          className={`toggle-button ${isConnected ? "connected" : ""}`}
          onClick={loginspotify}
          style={{
            background: `linear-gradient(to right, green ${animationProgress}%, #555 ${animationProgress}%)`,
          }}
        >
          <div className={`toggle-circle ${isConnected ? "active" : ""}`}></div>
        </div>
      ) : (
        <div>
          <input type="text" placeholder="Enter the playlist name" />
          <input type="text" placeholder="Enter the song name" />
          <button>Submit</button>
        </div>
      )}
    </div>
  );
}

export default Details;