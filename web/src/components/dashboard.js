import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import './dashboard.css';
import connectServices from './connectServices';
import TourGuide from './tourguide';
import PopularServices from './PopularServices';
import AreaDisplay from './areadisplay';


const CreateAppletModal = ({ isOpen, onClose, onCreateApplet }) => {
  const [services, setServices] = useState([]);
  const [selectedService1, setSelectedService1] = useState('');
  const [selectedService2, setSelectedService2] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [action, setAction] = useState({});
  const [reaction, setReaction] = useState({});
  const [selectedReaction, setSelectedReaction] = useState('');
  const [actions, setActions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [actionDescription, setActionDescription] = useState('');
  const [reactionDescription, setReactionDescription] = useState('');
  const [actionsParams, setActionsParams] = useState([]);
  const [reactionsParams, setReactionsParams] = useState([]);
  const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchServices();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getServices');
      console.log('Services:', response.data);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchServiceActions = async (serviceId) => {
    try {
      console.log('Fetching actions for service:', serviceId);
      const response = await axios.get(`http://localhost:8080/getServiceActions/${serviceId}`);
      console.log('Actions:', response.data);
      setActions(response.data);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };


  const fetchServiceReactions = async (serviceId) => {
    try {
      console.log('Fetching actions for service:', serviceId);
      const response = await axios.get(`http://localhost:8080/getServiceReactions/${serviceId}`);
      setReactions(response.data);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };


  const getInputAction = async (actionId) => {
    try {
      setSelectedAction(actionId);
      setActionsParams([]); // Clear previous params
      setActionDescription({}); // Clear previous descriptions
      const response = await axios.get(`http://localhost:8080/getAction/${actionId}`);
      const action = response.data.action[0].params.params;
      action.forEach(params => {
        console.log('actions params is :', params.name);
        actionsParams.push(params.name);
      });
      const newParams = action.map(params => params.name);
      setActionsParams(newParams);
      console.log('Action is :', action);
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };



  const getInputReaction = async (reactionId) => {
    try {
      setSelectedReaction(reactionId);
      setReactionsParams([]);
      setReactionDescription({});
      const response = await axios.get(`http://localhost:8080/getReaction/${reactionId}`);
      const reaction = response.data.reaction[0].params.params;
      const newParams = reaction.map(params => params.name);
      setReactionsParams(newParams);
      console.log('Reaction is :', reaction);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleService1Change = async (e) => {
    const serviceId = e.target.value;
    const user_id = localStorage.getItem('userId');
    setSelectedService1(serviceId);
    setSelectedAction('');
    const response = await axios.get(`http://localhost:8080/isUserLogin/${serviceId}/${user_id}`);
    console.log("RESPONSE IS", response.data);

    if (serviceId == 2 || serviceId == 3  || serviceId == 4  || serviceId == 5) {
      fetchServiceActions(serviceId);
    } else if (response.data.login === true) {
      fetchServiceActions(serviceId);
    } else {
      navigate(`/connectServices/${serviceId}`);
      console.log('USER IS NOT LOGGED IN');
    }
  };

  const handleService2Change = async (e) => {
    const serviceId = e.target.value;
    console.log("THE SERVICE ID IS", serviceId);
    const user_id = localStorage.getItem('userId');
    setSelectedService2(serviceId);
    setSelectedReaction('');
    const response = await axios.get(`http://localhost:8080/isUserLogin/${serviceId}/${user_id}`);
    console.log("RESPONSE IS", response.data);

    if (serviceId == 2 || serviceId == 3  || serviceId == 4  || serviceId == 5) {
      fetchServiceReactions(serviceId);
    } else if (response.data.login === true) {
      fetchServiceReactions(serviceId);
    } else {
      navigate(`/connectServices/${serviceId}`);
      console.log("USER IS NOT LOGGED IN");
    }
  };

  if (!isOpen) return null;

  
  const handleCreateApplet = () => {
    // Validate selections
    console.log("the selected action is " + action);
    if (selectedService1 && selectedService2 && selectedAction && selectedReaction) {
      onCreateApplet({
        service1: selectedService1,
        service2: selectedService2,
        action: selectedAction,
        reaction: selectedReaction,
        actionDescription: actionDescription,
        reactionDescription: reactionDescription 
      });
      onClose();
    } else {
      alert('Please select all options');
    }
  };

  const handleClose = () => {
    setActionDescription({});
    setReactionDescription({});
    setActionsParams([]);
    setReactionsParams([]);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <h2>Create New Applet</h2>
        <div className="modal-columns">
          <div className="modal-column">
            <h3>When This</h3>
            <select
              value={selectedService1}
              onChange={handleService1Change}
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            {selectedService1 && (
              <select
                value={selectedAction}
                onChange={(e) => getInputAction(e.target.value)}
              >
                <option value="">Select Action</option>
                {actions.map(action => (
                  <option key={action.id} value={action.id}>{action.name}</option>
                ))}
              </select>
            )}
            {selectedAction && actionsParams.map((param, index) => (
              <textarea
                key={index}
                className="description-textarea"
                placeholder={`Enter ${param}`}
                value={actionDescription[param] || ''}
                onChange={(e) => {
                  const newActionDescription = {...actionDescription};
                  newActionDescription[param] = e.target.value;
                  setActionDescription(newActionDescription);
                }}
            />))}
          </div>
          <div className="modal-column">
            <h3>Do This</h3>
            <select
              value={selectedService2}
              onChange={handleService2Change}
            >
              <option value="">Select Service</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>

            {selectedService2 && (
              <select
                value={selectedReaction}
                onChange={(e) =>getInputReaction(e.target.value)}
              >
                <option value="">Select Reaction</option>
                {reactions.map(reaction => (
                  <option key={reaction.id} value={reaction.id}>{reaction.name}</option>
                ))}
              </select>
            )}
            {selectedReaction && reactionsParams.map((param, index) => (
            <textarea
              key={index}
              className="description-textarea"
              placeholder={`Enter ${param}`}
              value={reactionDescription[param] || ''}
              onChange={(e) => {
                const newReactionDescription = {...reactionDescription};
                newReactionDescription[param] = e.target.value;
                setReactionDescription(newReactionDescription);
              }}
            />))}
          </div>
        </div>
        <button
          className="create-applet-button"
          onClick={handleCreateApplet}
        >
          Create Applet
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showTour, setShowTour] = useState(false); // Activer/désactiver le guide
  const [currentStep, setCurrentStep] = useState(0); // Étape actuelle du guide
  const [Areas, setAreas] = useState([]);

  const getExistedAreas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/getAREAs');
      setAreas(response.data);
      console.log("THE AREAS ARE: ", response.data);
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  useEffect(() => {
    getExistedAreas()
  }, []);

  const [cards, setCards] = useState(
    Areas.fill(0).map((_, i) => ({
      id: i + 1,
      color:
        i % 5 === 0 ? '#DAD4DE' :
        i % 5 === 1 ? '#BBB4DE' :
        i % 5 === 2 ? '#7B9DD2' :
        i % 5 === 3 ? '#70C7C6' :
        '#F2B880',
      title: `Card Title ${i + 1}`,
      subtitle: `Subtitle for card ${i + 1}`,
      details: `Detailed description for card ${i + 1}. This is an example of interactive content.`,
    }))
  );

  
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setShowTour(true); // Afficher le guide si non vu
    }
  }, []);

  const handleCardClick = (card) => {
    navigate(`/details/${card.id}`, { state: { card } });
  };


  const handleServiceSelect = (serviceId) => {
    console.log(`Selected service: ${serviceId}`);
};

  const createActionsReactions = async (userId, actionId, reactionId, actionDescription, reactionDescription) => {
    const [actionResponse, reactionResponse] = await Promise.all([
      axios.get(`http://localhost:8080/getAction/${actionId}`),
      axios.get(`http://localhost:8080/getReaction/${reactionId}`),
    ]);

    const actionParams = actionResponse.data.action[0].params.params;
    const reactionParams = reactionResponse.data.reaction[0].params.params;

    const actionParamsObject = actionParams.reduce((acc, param) => {
      acc[param.name] = actionDescription[param.name];
      return acc;
    }, {});

    const reactionParamsObject = reactionParams.reduce((acc, param) => {
      acc[param.name] = reactionDescription[param.name];
      return acc;
    }, {});

    const JsonReponse = {
      user_id: userId,
      action: {
        id: actionId,
        params: actionParamsObject,
      },
      reaction: {
        id: reactionId,
        params: reactionParamsObject,
      },
    };

    const response = await axios.post('http://localhost:8080/CreateActionReaction', {
      JsonReponse,
    });

    console.log('Action/Reaction created:', response.data);
    return response.data;
  };

  const handleCreateApplet = (newApplet) => {
    const user_id = localStorage.getItem('userId');

    if (!newApplet.service1 || !newApplet.service2 || !newApplet.action || !newApplet.reaction) {
      alert('Veuillez compléter toutes les options avant de créer un Applet.');
      return;
    }

    const handleCreateApplet = (newApplet) => {
      const user_id = localStorage.getItem('userId');
      const newCard = {
        id: cards.length + 1,
        color: '#F4F0E3',
        title: `${newApplet.service1} to ${newApplet.service2}`,
        subtitle: `${newApplet.action} → ${newApplet.reaction}`,
        details: `Action: ${newApplet.actionDescription}\nReaction: ${newApplet.reactionDescription}` // Use descriptions from new applet data
      };
      setCards([...cards, newCard]);
      createActionsReactions(user_id, newApplet.action, newApplet.reaction, newApplet.actionDescription, newApplet.reactionDescription);
    };

    const newCard = {
      id: cards.length + 1,
      color: '#F4F0E3',
      title: `${newApplet.service1} to ${newApplet.service2}`,
      subtitle: `${newApplet.action} → ${newApplet.reaction}`,
      details: `Action: ${JSON.stringify(newApplet.actionDescription)}\nReaction: ${JSON.stringify(newApplet.reactionDescription)}`,
    };

    // Ajouter la nouvelle carte et mettre à jour l'état
    setCards((prevCards) => [...prevCards, newCard]);

    // Affichez les données des cartes pour le débogage
    console.log('Nouvelle carte créée :', newCard);
    console.log('Cartes actuelles :', [...cards, newCard]);
  };


  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowTour(false);
      localStorage.setItem('hasSeenTour', 'true'); // Enregistrer que le guide a été vu
    }
  };

  const closeTour = () => {
    setShowTour(false);
    localStorage.setItem('hasSeenTour', 'true'); // Enregistrer que le guide a été vu
  };

  return (
    <div className="App dashboard-page">
      <header className="header">
        <div className="logo">IFTTT</div>
        <nav className="nav-links">
          <a href="#">Explore</a>
          <a href="#">Solutions</a>
          <a href="#">My Applets</a>
          <button className="create-button" onClick={() => setIsCreateModalOpen(true)}>
            Create
          </button>
          <button className="create-button" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      {/* Afficher le guide si actif */}
      {showTour && (
        <TourGuide
          onClose={closeTour}
          currentStep={currentStep}
          onNextStep={handleNextStep}
        />
      )}

      <main className="main">
        <div className="filters">
          <button>All</button>
          <button>Applets</button>
          <button>Services</button>
          <button>Stories</button>
        </div>
        <input
          className="search-bar"
          type="text"
          placeholder="Search Applets or services"
        />
        <h1>Explore</h1>

      {/* Nouvelle section "Discover Automation" */}
      <section className="discover-automation">
        <h2>Discover Automation</h2>
        <p>Connect your favorite services and automate your digital life</p>
        <div className="card-container">
          {/* Mettre ici les applets mis en avant */}
          <div className="highlight-card spotify">
            <h3>Save Spotify songs to playlist</h3>
            <p>Automatically save liked songs to a specific playlist</p>
          </div>
          <div className="highlight-card twitter">
            <h3>Twitter to Instagram</h3>
            <p>Share your tweets as Instagram posts</p>
          </div>
          <div className="highlight-card weather">
            <h3>Weather notifications</h3>
            <p>Get daily weather updates via email</p>
          </div>
        </div>
      </section>
      <section className="popular-services">
      <PopularServices onServiceSelect={(serviceId) => {
          console.log(`Selected service: ${serviceId}`);

      }} />

               <div className="area-display-section">
                  <AreaDisplay />
                </div>
              </section>

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

      {/* Modal pour la création d'un Applet */}
      <CreateAppletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateApplet={handleCreateApplet}
      />
    </div>
    
  );
};

export default Dashboard;
