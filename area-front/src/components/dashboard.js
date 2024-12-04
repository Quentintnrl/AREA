import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [appletStats, setAppletStats] = useState(null);
  const [connectedServices, setConnectedServices] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('/api/dashboard');
        setAppletStats(response.data.appletStats);
        setConnectedServices(response.data.connectedServices);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <img src="ifttt-logo.svg" alt="IFTTT" className="logo" />
        <nav>
          <a href="#">Explore</a>
          <a href="#">My Applets</a>
          <a href="#">Connections</a>
          <a href="#">Settings</a>
        </nav>
      </header>

      <main className="dashboard-content">
        <section className="applet-stats-section">
          <h2>Applet Stats</h2>
          {appletStats ? (
            <div className="applet-stats-grid">
              <div className="applet-stat">
                <h3>Total Applets</h3>
                <p>{appletStats.totalApplets}</p>
              </div>
              <div className="applet-stat">
                <h3>Successful Runs</h3>
                <p>{appletStats.successfulRuns}</p>
              </div>
              <div className="applet-stat">
                <h3>Failed Runs</h3>
                <p>{appletStats.failedRuns}</p>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </section>

        <section className="connected-services-section">
          <h2>Connected Services</h2>
          {connectedServices.length > 0 ? (
            <ul className="connected-services-list">
              {connectedServices.map((service, index) => (
                <li key={index}>
                  <img src={service.logo} alt={service.name} />
                  <h3>{service.name}</h3>
                </li>
              ))}
            </ul>
          ) : (
            <p>No connected services yet.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;