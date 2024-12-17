import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import axios from 'axios';
import './dashboard.css';

const CreateAppletModal = ({ isOpen, onClose, onCreateApplet }) => {
  const [services, setServices] = useState([]);
  const [selectedService1, setSelectedService1] = useState('');
  const [selectedService2, setSelectedService2] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedReaction, setSelectedReaction] = useState('');
  const [actions, setActions] = useState([]);
  const [reactions, setReactions] = useState([]);
  const [actionDescription, setActionDescription] = useState(''); // New state variable for action text area
  const [reactionDescription, setReactionDescription] = useState(''); // New state variable for reaction text area

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

  const fetchActions = async (serviceId) => {
    try {
      console.log('Fetching actions for service:', serviceId);
      const response = await axios.get('http://localhost:8080/getActions');
      const actions = response.data.filter(action => action.service_id === serviceId);
      return
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };


  const handleService1Change = (e) => {
    const serviceId = e.target.value;
    setSelectedService1(serviceId);
    setSelectedAction('');
    fetchServiceActions(serviceId);
  };

  const handleService2Change = (e) => {
    const serviceId = e.target.value;
    setSelectedService2(serviceId);
    setSelectedReaction('');
    fetchServiceReactions(serviceId);
  };

  if (!isOpen) return null;

  const handleCreateApplet = () => {
    // Validate selections
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
                onChange={(e) => setSelectedAction(e.target.value)}
              >
                <option value="">Select Action</option>
                {actions.map(action => (
                  <option key={action.id} value={action.id}>{action.name}</option>
                ))}
              </select>
            )}
            <textarea
              className="description-textarea"
              placeholder="Enter action description"
              value={actionDescription}
              onChange={(e) => setActionDescription(e.target.value)}
            />
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
                onChange={(e) => setSelectedReaction(e.target.value)}
              >
                <option value="">Select Reaction</option>
                {reactions.map(reaction => (
                  <option key={reaction.id} value={reaction.id}>{reaction.name}</option>
                ))}
              </select>
            )}
            <textarea
              className="description-textarea"
              placeholder="Enter reaction description"
              value={reactionDescription}
              onChange={(e) => setReactionDescription(e.target.value)}
            />
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

  const handleCreateApplet = (newApplet) => {
    const newCard = {
      id: cards.length + 1,
      color: '#F4F0E3',
      title: `${newApplet.service1} to ${newApplet.service2}`,
      subtitle: `${newApplet.action} → ${newApplet.reaction}`,
      details: `Action: ${newApplet.actionDescription}\nReaction: ${newApplet.reactionDescription}` // Use descriptions from new applet data
    };

    setCards([...cards, newCard]);
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