const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');
const { Spotify } = require('./Spotify');
const add_spotify_tokens = require('./Spotify').addSpotifyTokens;
const pool = require('../db').connection;
const disconnect = require('../db').close;

async function add_user_tokens(user_id, service_id, tokens) {
    try {
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [service_id]);
        console.log('Service:', service[0].name);
        switch (service[0].name) {
            case 'spotify':
                // disconnect();
                add_spotify_tokens(user_id, service_id, tokens);
                return
            default:
                throw new Error('Service not supported');
        }
    } catch (error) {
        console.error('Error fetching data from services table:', error);
        //disconnect();
    }
    // disconnect();
}

const getAllActions = async () => {
    try {
        // Query to get all rows from the 'actions' table
        const [rows] = await pool.query('SELECT * FROM actions');

        // Return the rows (the result of the query)
        return rows;
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error fetching data from actions table:', error);
        throw new Error('Could not fetch actions data.');
    }
};

const getAllReactions = async () => {
    try {
        // Query to get all rows from the 'actions' table
        const [rows] = await pool.query('SELECT * FROM reactions');

        // Return the rows (the result of the query)
        return rows;
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error fetching data from actions table:', error);
        throw new Error('Could not fetch actions data.');
    }
};

const query = async () => {
    try {
      // Execute the query to get all rows from the 'services' table
      const [rows] = await pool.query('SELECT id, name FROM services');

      // Format the result as an array of objects (if needed)
      const services = rows.map(row => ({ id: row.id, name: row.name }));

      // Log or use the resulting array
      console.log(services);
      return services;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

class ServiceManager {
    constructor() {
        this.services = [];
        this.servicesFactory = new ServicesFactory();
        this.servicesList = [];
    }

    async init() {
        try {
            this.services = await query();
            for (const service of this.services) {
                const serviceInstance = this.servicesFactory.createService(service.name, service.id);
                this.servicesList.push(serviceInstance);
            }
            console.log('ServiceManager initialized');
        } catch (error) {
            console.error('Error initializing ServiceManager:', error);
            throw error;
        }
    }

    async checkAction(id, params) {
        if (typeof id !== 'number') {
            console.error('Invalid action id');
            return false;
        }
        if (typeof actionParams === 'object' && actionParams !== null) {
            console.error('Invalid action params');
            return false;
        }
        const actions = await getAllActions();
        for (const action of actions) {
            for (const service of this.servicesList) {
                if (action.service_id === service.id) {
                    const task = new Task(id, action.name, params);
                    service.do_task(task);
                    return true;
                }
            }
        }
        return false;
    }

    async executeReaction(id, params) {
        if (typeof id !== 'number') {
            console.error('Invalid action id');
            return false;
        }
        if (typeof actionParams === 'object' && actionParams !== null) {
            console.error('Invalid action params');
            return false;
        }
        const reactions = await getAllReactions();
        for (const reaction of reactions) {
            for (const service of this.servicesList) {
                if (reaction.service_id === service.id) {
                    const task = new Task(id, reaction.name, params);
                    service.do_task(task);
                }
            }
        }
    }
}

module.exports = { ServiceManager, add_user_tokens };