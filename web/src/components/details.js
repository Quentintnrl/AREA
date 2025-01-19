import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./details.css";
import axios from "axios";

function Details() {
  const { actionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const card = location.state?.card;

  const deleteArea = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const actionId = card?.actionId;
      const reactionId = card?.reactionId;
      const id = card?.id;
      console.log("userId: ", userId);
      console.log("actionId: ", actionId);
      console.log("reactionId: ", reactionId);
      await axios.delete(`http://localhost:8080/deleteAREA/${userId}/${id}`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Delete failed', error.response?.data);
    }
  };

  return (
    <div className="details-container">
      <div className="details-card">
        <h1 className="details-title">AREA Details</h1>

        <div className="area-info">
          <div className="action-section">
            <h2>Action</h2>
            <h3>Action name : {card?.actionName || "Action Name"}</h3>
            <p>{card?.actionDescription || "Action description not available."}</p>
          </div>

          <div className="reaction-section">
            <h2>Reaction</h2>
            <h3>Reaction name: {card?.reactionName || "Reaction Name"}</h3>
            <p>{card?.reactionDescription || "Reaction description not available."}</p>
          </div>
        </div>

        <div className="button-group">
          <button
            className="delete-button"
            onClick={deleteArea}
          >
            Delete AREA
          </button>
          <button
            className="back-button"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default Details;