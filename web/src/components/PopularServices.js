import React, { useState } from 'react';
import axios from 'axios';
import './popular.css';

const PopularServices = ({ onServiceSelect }) => {
    const [selectedService, setSelectedService] = useState(null);
    const [actions, setActions] = useState([]);
    const [reactions, setReactions] = useState([]);
    const [error, setError] = useState(null);

    const services = [
        { id: "1", name: "Spotify" },
        { id: "2", name: "Github" },
        { id: "3", name: "Time and Date" },
        { id: "4", name: "Email" },
        { id: "5", name: "Weather" }
    ];
    const fetchServiceData = async (serviceId) => {
        console.log('Fetching data for service:', serviceId);
        setError(null);
        
        try {
            const actionsUrl = `http://localhost:8080/getServiceActions/${serviceId}`;
            const reactionsUrl = `http://localhost:8080/getServiceReactions/${serviceId}`;
            
            console.log('Fetching actions from:', actionsUrl);
            console.log('Fetching reactions from:', reactionsUrl);
    
            const actionsResponse = await axios.get(actionsUrl);
            console.log('Actions response:', actionsResponse.data);
            
            const reactionsResponse = await axios.get(reactionsUrl);
            console.log('Reactions response:', reactionsResponse.data);
    
            if (actionsResponse.data && reactionsResponse.data) {
                setActions(actionsResponse.data);
                setReactions(reactionsResponse.data);
                setSelectedService(serviceId);
                
                if (onServiceSelect) {
                    onServiceSelect(serviceId);
                }
            }
        } catch (error) {
            console.error("Error details:", {
                message: error.message,
                response: error.response,
                config: error.config
            });
            setError(`Error fetching data: ${error.message}`);
        }
    };
    return (
        <section className="popular-services">
            <h2>Popular Services</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="services-grid">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`service-card ${service.id}`}
                        onClick={() => fetchServiceData(service.id)}
                    >
                        <span className="service-name">{service.name}</span>
                        {selectedService === service.id && (
                            <div className="service-details">
                                <div>
                                    <h3>Actions</h3>
                                    {actions && actions.length > 0 ? (
                                        <ul>
                                            {actions.slice(0, 3).map((action, index) => (
                                                <li key={index}>{action.name || action}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No actions available</p>
                                    )}
                                </div>
                                <div>
                                    <h3>Reactions</h3>
                                    {reactions && reactions.length > 0 ? (
                                        <ul>
                                            {reactions.slice(0, 3).map((reaction, index) => (
                                                <li key={index}>{reaction.name || reaction}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No reactions available</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default PopularServices;