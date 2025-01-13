const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');




//                                                                                  FUNCTIONS UTILS





//                                                                                  ACTIONS





//                                                                                  REACTIONS





//                                                                             JSON CREATION

/**
 * Create the json for the Spotify actions and reactions.
 *
 * @param {JSON} request_json - The json send in the request.
 * @param {string} target_name - The name of the action/reaction.
 * @returns {Promise<string>} - Returns the json for the database.
 */
async function create_json(request_json, target_name, user_id, service_id) {
    console.log('user_id:', user_id);
    console.log('service_id:', service_id);
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





//                                                                           Date and Time CLASS

class Weather extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Weather service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        if (task instanceof Task) {
            console.log(`Weather service is doing task: ${task.name}`);

            switch (task.name) {

                //Actions

                //Reactions
            }
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return value;
    }
}

module.exports = { Weather, create_json };