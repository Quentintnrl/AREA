
import "./tourguide.css";
import React, { useEffect, useState } from 'react';

const TourGuide = ({ onClose, currentStep, onNextStep }) => {
  const steps = [
    {
      instruction: 'Click on "Create" to create a new applet and open the modale.',
      target: '.create-button', // L'élément cible
    },
    {
      instruction: 'Choose a service from the "When This" section.',
      target: '.modal-content', // L'élément cible
    },
    {
      instruction: 'Search for Applets or Services.',
      target: '.search-bar', // L'élément cible
    },
    {
      instruction: 'Click on a this for more option .',
      target: '.filters button', // L'élément cible
    },
  ];

  const [arrowPosition, setArrowPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const step = steps[currentStep];
    let observer;
  
    const checkTargetElement = () => {
      const targetElement = document.querySelector(step.target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        setArrowPosition({
          top: rect.top + window.scrollY + rect.height / 2,
          left: rect.left + window.scrollX + rect.width / 2, // Centrer horizontalement
        });
        if (observer) observer.disconnect(); // Arrêter l'observation si trouvé
      }
    };
  
    // Vérifier immédiatement
    checkTargetElement();
  
    // Configurer un MutationObserver pour surveiller les changements dans le DOM
    observer = new MutationObserver(checkTargetElement);
    observer.observe(document.body, { childList: true, subtree: true });
  
    return () => {
      if (observer) observer.disconnect(); // Nettoyer l'observateur
    };
  }, [currentStep, steps]);
  
  useEffect(() => {
    const step = steps[currentStep];
    const targetElement = document.querySelector(step.target);

    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      setArrowPosition({
        top: rect.top + window.scrollY + rect.height / 2,
        left: rect.left + window.scrollX + rect.width / 2, // Centrer horizontalement
      });
    } else {
      console.warn(`Target element not found: ${step.target}`);
    }
  }, [currentStep, steps]);

  const step = steps[currentStep];

  return (
    <div className="tour-guide-overlay">
      <div className="tour-guide-content">
        <h2>Welcome to Your Dashboard!</h2>
        <p>{step.instruction}</p>
        <button className="close-tour" onClick={onClose}>
          Got it!
        </button>
        <button className="next-step" onClick={onNextStep}>
          Next
        </button>
      </div>
      {/* Ajouter la flèche à la bonne position */}
      <div
        className="tour-guide-arrow"
        style={{
          top: `${arrowPosition.top}px`,
          left: `${arrowPosition.left}px`,
        }}
      ></div>
    </div>
  );
};

export default TourGuide;
