const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');
const { Spotify } = require('./Spotify');
const add_spotify_tokens = require('./Spotify').addSpotifyTokens;
const checkSpotifyActionReaction = require('./Spotify').checkSpotifyActionReaction;
const pool = require('../db').connection;
const disconnect = require('../db').close;

async function add_user_tokens(user_id, service_id, tokens) {
    try {
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [service_id]);
        console.log('Service:', service[0].name);
        switch (service[0].name) {
            case 'spotify':
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

async function testActionCreation(user_id, actionJson) {
    try {
        const [action] = await pool.query('SELECT * FROM actions WHERE id = ?', [actionJson.id]);
        if (action.length !== 1) {
            console.log('error action:', action);
            return false;
        }
        console.log('action:', action[0]);
        const actionName = action[0].name;
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [action[0].service_id]);
        console.log('service:', service[0]);
        switch (service[0].name) {
            case 'Spotify':
                return await checkSpotifyActionReaction(actionJson.params, actionName, user_id, action[0].service_id);
            default:
                throw new Error('Service not supported');
        }
        return true;
    } catch (error) {
        console.error('Error fetching data from actions table:', error);
        throw new Error('Could not fetch actions data.');
    }
}

async function testReactionCreation(user_id, reactionJson) {
    try {
        const [reaction] = await pool.query('SELECT * FROM reactions WHERE id = ?', [reactionJson.id]);
        if (reaction.length !== 1) {
            return false;
        }
        console.log('reaction:', reaction[0]);
        const reactionName = reaction[0].name;
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [reaction[0].service_id]);
        console.log('service:', service[0]);
        switch (service[0].name) {
            case 'Spotify':
                return await checkSpotifyActionReaction(reactionJson.params, reactionName, user_id, reaction[0].service_id);
            default:
                throw new Error('Service not supported');
        }
        return true
    } catch (error) {
        console.error('Error fetching data from reactions table:', error);
        throw new Error('Could not fetch reactions data.');
    }
}

async function createServiceJson(user_id, json) {
    try {
        const [trigger] = await pool.query('SELECT * FROM reactions WHERE id = ?', [json.id]);
        if (trigger.length !== 1) {
            return false;
        }
        console.log('trigger:', trigger[0]);
        const name = trigger[0].name;
        const [service] = await pool.query('SELECT * FROM services WHERE id = ?', [trigger[0].service_id]);
        console.log('service:', service[0]);
        switch (service[0].name) {
            case 'Spotify':
                return await checkSpotifyActionReaction(json.params, name, user_id, trigger[0].service_id);
            default:
                throw new Error('Service not supported');
        }
        return true
    } catch (error) {
        console.error('Error fetching data from reactions table:', error);
        throw new Error('Could not fetch reactions data.');
    }
}

async function createActionReaction(user_id, actionJson, reactionJson) {
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [user_id]);
        console.log('user:', user[0]);

        if (!await testActionCreation(user_id, actionJson)) {
            throw new Error('Cannot create AREA, bad action');
        }
        if (!await testReactionCreation(user_id, reactionJson)) {
            throw new Error('Cannot create AREA, bad reaction');
        }
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

module.exports = { ServiceManager, add_user_tokens, createActionReaction };