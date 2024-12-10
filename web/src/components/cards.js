import React from "react";
import { useNavigate } from "react-router-dom";

function Card({ id, title }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("Card clicked! Navigating...");
    navigate(`/details/${id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <h3>{title}</h3>
    </div>
  );
}

export default Card;
