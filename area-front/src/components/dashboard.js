import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const cards = Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      color:
        i % 5 === 0
          ? '#F4F0E3'
          : i % 5 === 1
          ? '#DAD4DE'
          : i % 5 === 2
          ? '#BBB4DE'
          : i % 5 === 3
          ? '#7B9DD2'
          : '#70C7C6',
      title: `Card Title ${i + 1}`,
      subtitle: `Subtitle for card ${i + 1}`,
      details: `Detailed description for card ${i + 1}. This is an example of interactive content.`,
    }));

  const handleCardClick = (card) => {
    navigate(`/details/${card.id}`, { state: { card } });
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo">IFTTT</div>
        <button className="cta-button">Google Calendar automations</button>
      </header>
      <nav className="nav">
        <ul>
          <li>Explore</li>
          <li>Solutions</li>
          <li>My Applets</li>
          <li>
            <button className="create-button">Create</button>
          </li>
          <li>
            <button className="pro-button">Try Pro free</button>
          </li>
        </ul>
      </nav>
      <main className="main">
        <h1>Explore</h1>
        <div className="filters">
          <button>All</button>
          <button>Applets</button>
          <button>Services</button>
          <button>Stories</button>
        </div>
        <input className="search-bar" type="text" placeholder="Search Applets or services" />
        <div className="card-container">
          {cards.map((card) => (
            <div
              className="card"
              style={{ backgroundColor: card.color }}
              key={card.id}
              onClick={() => handleCardClick(card)}
            >
              <h2>{card.title}</h2>
              <p>{card.subtitle}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;