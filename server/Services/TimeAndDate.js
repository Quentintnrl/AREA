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

            case 'Date of the month': {
                console.log(request_json);
                const day = request_json.params["Day of the month"];
                console.log('Day:', day);
                const json = {
                    id: request_json.id,
                    params: {
                        "Day of the month": day,
                        "previous_month": -1
                    }
                };
                return json;
            }

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

class TimeAndDate extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Time and Date service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        if (task instanceof Task) {
            console.log(`Time and Date service is doing task: ${task.name}`);

            switch (task.name) {

                //Actions

                case 'Date of the month': {
                    console.log(task);
                    const day = task.params["Day of the month"];
                    console.log('Day:', day);
                    const previous_month = task.params["previous_month"];
                    console.log('Previous month:', previous_month);
                    //get current date
                    const date = new Date();
                    console.log('Current date:', date);
                    const current_month = date.getMonth();
                    console.log('Current month:', current_month);
                    const current_day = date.getDate();
                    console.log('Current day:', current_day);
                    if (previous_month != current_month && current_day == day) {
                        console.log('Day of the month reached');
                        value = true;
                        const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                        console.log('action_reaction:', action_reaction[0]);
                        let action = action_reaction[0].action;
                        let params = action.params;
                        console.log('params:', params);
                        params["previous_month"] = current_month;
                        console.log('new params:', params);
                        action.params = params;
                        console.log('new action:', action);
                        await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                    } else {
                        console.log('Day of the month not reached');
                    }
                }

                //Reactions
            }
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return value;
    }
}

module.exports = { TimeAndDate, create_json };