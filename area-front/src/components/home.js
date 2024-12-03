/*
** EPITECH PROJECT, 2024
** AREA
** File description:
** home
*/
import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaCloudSun, FaAndroid, FaInstagram } from "react-icons/fa"; 

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ backgroundColor: "#F4F0E3" }}>
      {/* Section Héros */}
      <header className="hero-section">
        <nav className="navbar">
          <div className="logo">
        <img src="logo.svg" alt="AREA" />
          </div>
          <ul className="nav-links">
            <li>
              <button
                className="nav-btn"
                onClick={() => navigate("/explore")}
                style={{ color: "#7B9DD2" }}
              >
                Explore
              </button>
            </li>
            <li>
              <button
                className="nav-btn"
                onClick={() => navigate("/solutions")}
                style={{ color: "#7B9DD2" }}
              >
                Solutions
              </button>
            </li>
            <li>
              <button
                className="nav-btn"
                onClick={() => navigate("/plans")}
                style={{ color: "#7B9DD2" }}
              >
                Plans
              </button>
            </li>
            <li>
              <button
                className="nav-btn"
                onClick={() => navigate("/signup")}
                style={{ color: "#7B9DD2" }}
              >
                Log in
              </button>
            </li>
            <li>
              <button
                className="btn-get-started"
                style={{
                  backgroundColor: "#70C7C6",
                  color: "white",
                  borderRadius: "20px",
                  padding: "0.75rem 2rem",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Get Started
              </button>
            </li>
          </ul>
        </nav>
        <div className="hero-content">
          <h1 style={{ color: "#BBB4DA", fontSize: "3rem", marginBottom: "1rem" }}>
            Automation for business and home
          </h1>
          <p style={{ color: "#DAD4DE", fontSize: "1.5rem", marginBottom: "2rem" }}>
            Save time and get more done
          </p>
          <button
            className="btn-start-today"
            style={{
              backgroundColor: "#70C7C6",
              color: "white",
              borderRadius: "20px",
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            Start today
          </button>
        </div>
      </header>
      {/* Section des Applets */}
      <section className="applets-section">
        <h2 style={{ color: "#BBB4DA", fontSize: "2rem", marginBottom: "2rem" }}>
          Get started with any Applet
        </h2>
        <div className="applets-container">
          {[
           {
            color: "#7B9DD2",
            title: "Quickly create events in a Google Calendar",
            info: { service: "Google", users: "127.7k" },
            icon: <FaGoogle />, // Icône pour Google
            extra: "Quick add event. Note widget. Any new note.",
          },
          {
            color: "#333",
            title: "Get the weather forecast every day at 7:00 AM",
            info: { service: "Weather Underground", users: "88.4k" },
            icon: <FaCloudSun />, // Icône pour la météo
            extra: "Today's weather report.",
          },
          {
            color: "#BBB4DA",
            title: "Update your Android wallpaper with NASA's image of the day",
            info: { service: "IFTTT", users: "348.7k" },
            icon: <FaAndroid />, // Icône pour Android
            extra: "Notifications. Send a notification from the IFTTT app.",
          },
          {
            color: "#FF6B6B",
            title: "Tweet your Instagrams as native photos on Twitter",
            info: { service: "Instagram", users: "603.7k" },
            icon: <FaInstagram />, // Icône pour Instagram
            extra: null,
          },
          ].map((applet, index) => (
            <div
              key={index}
              className="applet-card"
              style={{ backgroundColor: applet.color }}
            >
              <p style={{ color: "white", fontSize: "1.2rem", fontWeight: "bold" }}>
                {applet.title}
              </p>
              <div className="applet-info">
                <span style={{ color: "#DAD4DE", fontSize: "0.9rem" }}>
                  {applet.info.service}
                </span>
                <span style={{ color: "#DAD4DE", fontSize: "0.9rem" }}>
                  {applet.info.users} users
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Section des services */}
      <section className="services-section">
        <h2 style={{ color: "#BBB4DA", fontSize: "2rem", marginBottom: "2rem" }}>
          ... or choose from 900+ services
        </h2>
        <div className="services-container">
          {["Webhooks", "Facebook", "Google Calendar", "Spotify"].map(
            (service, index) => (
              <div
                key={index}
                className="service-icon"
                style={{
                  backgroundColor: "#7B9DD2",
                  color: "white",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  margin: "10px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {service}
              </div>
            )
          )}
        </div>
      </section>
      <div className="new-section">
        <div className="ifttt-section">
          <img src="ifttt-logo.svg" alt="IFTTT" />
          <div>
            <h3>IFTTT Pro and Pro+</h3>
            <p>Make your automations more powerful</p>
            <p>Customize and control your automations</p>
          </div>
        </div>
        <div className="explore-button-container">
          <button className="explore-button">Explore all</button>
        </div>
      </div>
    </div>
  );
};
export default HomePage;