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
import ifttlogo from "../assets/logoiftt.png";
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Section Héros */}
      <header className="hero-section">
        <nav className="navbar">
          <div className="logo">
            <img src="logo.svg" alt="AREA" />
          </div>
          <ul className="nav-links">
            <li><button className="nav-btn" onClick={() => navigate("/explore")}>Explore</button></li>
            <li><button className="nav-btn" onClick={() => navigate("/solutions")}>Solutions</button></li>
            <li><button className="nav-btn" onClick={() => navigate("/plans")}>Plans</button></li>
            <li><button className="nav-btn" onClick={() => navigate("/login")}>Log in</button></li>
            <li><button className="btn-get-started">Get Started</button></li>
          </ul>
        </nav>

        <div className="hero-content">
          <h1>Automation for business and home</h1>
          <p>Save time and get more done</p>
          <button className="btn-start-today">Start today</button>
        </div>
      </header>

      {/* Section des Applets */}
      <section className="applets-section">
        <h2>Get started with any Applet</h2>
        <div className="applets-container">
          {[
            {
              color: "#7B9DD2",
              title: "Quickly create events in a Google Calendar",
              info: { service: "Google", users: "127.7k" },
              icon: <FaGoogle />,
              extra: "Quick add event. Note widget. Any new note.",
            },
            {
              color: "#333",
              title: "Get the weather forecast every day at 7:00 AM",
              info: { service: "Weather Underground", users: "88.4k" },
              icon: <FaCloudSun />,
              extra: "Today's weather report.",
            },
            {
              color: "#BBB4DA",
              title: "Update your Android wallpaper with NASA's image of the day",
              info: { service: "IFTTT", users: "348.7k" },
              icon: <FaAndroid />,
              extra: "Notifications. Send a notification from the IFTTT app.",
            },
            {
              color: "#FF6B6B",
              title: "Tweet your Instagrams as native photos on Twitter",
              info: { service: "Instagram", users: "603.7k" },
              icon: <FaInstagram />,
              extra: null,
            },
          ].map((applet, index) => (
            <div key={index} className="applet-card" style={{ backgroundColor: applet.color }}>
              <p>{applet.title}</p>
              <div className="applet-info">
                <span>{applet.info.service}</span>
                <span>{applet.info.users} users</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section des services */}
      <section className="services-section">
        <h2>... or choose from 900+ services</h2>
        <div className="services-container">
          {["Webhooks", "Facebook", "Google Calendar", "Spotify"].map(
            (service, index) => (
              <div key={index} className="service-icon">
                {service}
              </div>
            )
          )}
        </div>
      </section>

      <div className="new-section">
        <div className="ifttt-section">
          <img src={ifttlogo} alt="IFTTT" />
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
