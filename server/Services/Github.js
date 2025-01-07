const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');





//                                                                             JSON CREATION

/**
 * Create the json for the Github actions and reactions.
 *
 * @param {JSON} request_json - The json send in the request.
 * @param {string} target_name - The name of the action/reaction.
 * @returns {Promise<string>} - Returns the json for the database.
 */
async function create_json(request_json, target_name, user_id, service_id) {
    console.log('user_id:', user_id);
    console.log('service_id:', service_id);
    const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
    try {
        console.log('Creating json for:\"', target_name, '\"');
        switch (target_name) {
            //actions

            //reactions

            default: {
                throw new Error('Action/Reaction not supported');
            }
        }
    } catch (error) {
        console.error('Error creating json:', error);
    }
}




//                                                                             TOKENS

async function addGithubTokens(user_id, service_id, tokens) {
    try {
    } catch (error) {
        console.error('Error adding Github tokens:', error);
        throw new Error('Failed to add Github tokens.');
    }
}





//                                                                             Github class

class Github extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Github service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        return value;
    }
}

module.exports = { Github, addGithubTokens, create_json };
