import "./tourguide.css";
import React, { useEffect, useState } from 'react';

const TourGuide = ({ onClose, currentStep, onNextStep }) => {
  const steps = [
    {
      instruction: 'Click on "Create" to create a new applet and open the modale.',
      target: ".create-button",
    },
    {
      instruction: 'Choose a service from the "When This" section.',
      target: ".modal-column select",
    },
    {
      instruction: "Search for Applets or Services.",
      target: ".search-bar",
    },
    {
      instruction: "Click on this for more options.",
      target: ".filters button",
    },
  ];

  // Ensure currentStep is within bounds
  const validStep = steps[currentStep] || {};
  const instruction = validStep.instruction || 'No instruction available for this step.';

  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });
  const [showBadge, setShowBadge] = useState(false); // New state to show the badge

  useEffect(() => {
    if (validStep.target) {
      const targetElement = document.querySelector(validStep.target);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setArrowPosition({
          top: rect.top + window.scrollY + rect.height / 2,
          left: rect.left + window.scrollX + rect.width / 2,
        });
      } else {
        console.warn(`Target element not found: ${validStep.target}`);
      }
    }
  }, [currentStep, validStep]);

  const handleGotItClick = () => {
    setShowBadge(true); // Show the badge
  };

  return (
    <>
      {showBadge ? (
        <div className="badge-overlay">
          <div className="badge-content">
            <div className="confetti"></div> {/* Confetti section */}
            <h2>🎉 Tour Terminé ! 🎉</h2>
            <p>Vous avez terminé le guide et êtes prêt à explorer !</p>
            <button onClick={onClose} className="close-tour">
              Continuer
            </button>
          </div>
        </div>
      ) : (
        <div className="tour-guide-overlay">
          <div className="tour-guide-content">
            <h2>Welcome to Your Dashboard!</h2>
            <p>{instruction}</p> {/* Ensure instruction is available */}
            <button className="close-tour" onClick={onClose}>
              Close
            </button>
            <button className="next-step" onClick={onNextStep}>
              Next
            </button>
            <button className="got-it" onClick={handleGotItClick}>
              Got it!
            </button>
          </div>
          <div
            className="tour-guide-arrow"
            style={{
              top: `${arrowPosition.top}px`,
              left: `${arrowPosition.left}px`,
            }}
          ></div>
        </div>
      )}
    </>
  );
};

export default TourGuide;
