const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');
const { Spotify } = require('./Spotify');
const add_spotify_tokens = require('./Spotify').addSpotifyTokens;
const spotify_create_json = require('./Spotify').create_json;
const pool = require('../db').connection;
const disconnect = require('../db').close;

const ActionOrReaction = {
    Action: "action",
    Reaction: "reaction",
};

async function create_json(request_json, user_id, action_or_reaction) {
    try {
        const id = request_json.id;
        console.log('id:', id);
        target = [];
        if (action_or_reaction === "action") {
            [target] = await pool.query('SELECT * FROM actions WHERE id = ?', [id]);
        } else if (action_or_reaction === "reaction") {
            [target] = await pool.query('SELECT * FROM reactions WHERE id = ?', [id]);
        }
        console.log(target);
        const service_id = target[0].service_id;
        console.log('service_id:', service_id);
        const [services] = await pool.query('SELECT * FROM services WHERE id = ?', [service_id]);
        const service_name = services[0].name;
        console.log('service_name:', service_name);
        switch (service_name) {
            case 'Spotify':
                return await spotify_create_json(request_json, target[0].name, user_id, service_id);
            default:
                throw new Error('Service not supported');
        }
    } catch (error) {
        console.error('Error creating json:', error);
    }
}

async function add_user_tokens(user_id, service_id, tokens) {
    try {
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [service_id]);
        console.log('Service:', service[0].name);
        switch (service[0].name) {
            case 'Spotify':
                if (add_spotify_tokens(user_id, service_id, tokens).length != 0)
                    return true ;
                else
                    return false;
            default:
                throw new Error('Service not supported');
        }
    } catch (error) {
        console.error('Error fetching data from services table:', error);
    }
}

async function createActionReaction(user_id, actionJson, reactionJson) {
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
        console.log('user:', user[0]);

        console.log(actionJson);
        console.log(reactionJson);
        const action = JSON.stringify(actionJson);
        const reaction = JSON.stringify(reactionJson);
        await pool.query(
            'INSERT INTO action_reaction (user_id, action, reaction) VALUES (?, ?, ?)',
            [user_id, action, reaction]
        );
    } catch (error) {
        console.error('Error creating action and reaction:', error);
    }
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

    async checkAction(user_id, params, action_id, action_reaction_id) {
        if (typeof user_id !== 'number') {
            console.error('Invalid action id');
            return false;
        }
        if (typeof actionParams === 'object' && actionParams !== null) {
            console.error('Invalid action params');
            return false;
        }
        console.log('action_reaction_id:', action_reaction_id);
        const [action] = await pool.query('SELECT * FROM actions WHERE id = ?', [action_id]);
        console.log('action:', action[0]);
        for (const service of this.servicesList) {
            console.log('service id:', service.id);
            console.log('action service id:', action[0].service_id);
            if (action[0].service_id === service.id) {
                const task = new Task(user_id, action[0].name, params);
                console.log('task:', task);
                return await service.do_task(task, action_reaction_id);
            }
        }
        return false;
    }

    async executeReaction(user_id, params, reaction_id, action_reaction_id) {
        if (typeof user_id !== 'number') {
            console.error('Invalid action id');
            return false;
        }
        if (typeof actionParams === 'object' && actionParams !== null) {
            console.error('Invalid action params');
            return false;
        }
        const [reaction] = await pool.query('SELECT * FROM reactions WHERE id = ?', [reaction_id]);
        for (const service of this.servicesList) {
            if (reaction[0].service_id === service.id) {
                const task = new Task(user_id, reaction[0].name, params);
                service.do_task(task, action_reaction_id);
            }
        }
    }
}

module.exports = { ServiceManager, add_user_tokens, createActionReaction, create_json, ActionOrReaction };