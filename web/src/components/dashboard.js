import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import './dashboard.css';
import connectServices from './connectServices';

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

    if (serviceId == 2 || serviceId == 3) {
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

    if (serviceId == 2 || serviceId == 3) {
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
        actionDescription: actionDescription, // Include action description in new applet data
        reactionDescription: reactionDescription // Include reaction description in new applet data
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

function Dashboard() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [cards, setCards] = useState(
    Array(4).fill(0).map((_, i) => ({
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

  const handleCardClick = (card) => {
    navigate(`/details/${card.id}`, { state: { card } });
  };

  const createActionsReactions = async (userId, actionId, reactionId, actionDescription, reactionDescription) => {
    const [actionResponse, reactionResponse] = await Promise.all([
      axios.get(`http://localhost:8080/getAction/${actionId}`),
      axios.get(`http://localhost:8080/getReaction/${reactionId}`)
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
      "user_id": userId,
      "action": {
        "id": actionId,
        "params": actionParamsObject
      },
      "reaction": {
        "id": reactionId,
        "params": reactionParamsObject
      }
    };

    console.log("the JSON response is", JsonReponse);

    const response = await axios.post('http://localhost:8080/CreateActionReaction', {
      JsonReponse
    });

    console.log('Action/Reaction created:', response.data);
    return response.data;
  };

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
            <button
              className="create-button"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create
            </button>
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
        <input
          className="search-bar"
          type="text"
          placeholder="Search Applets or services"
        />

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

      <CreateAppletModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateApplet={handleCreateApplet}
      />
    </div>
  );
}

export default Dashboard;