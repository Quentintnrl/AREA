const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');
const nodemailer = require('nodemailer');

// Email service login
const EMAIL_ADRESS = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;




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

            case 'Send email': {
                console.log(request_json);
                const email = request_json.params["Email adress"];
                console.log('email: ', email);
                return request_json;
            }

            default: {
                throw new Error('Action/Reaction not supported');
            }
        }
    } catch (error) {
        console.error('Error creating json:', error);
    }
}





//                                                                           Date and Time CLASS

class Email extends AbstractService {
    constructor(id, name) {
        super(id, name);
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: EMAIL_ADRESS,
              pass: EMAIL_PASSWORD
            }
        });
        console.log('Email service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        if (task instanceof Task) {
            console.log(`Email service is doing task: ${task.name}`);

            switch (task.name) {

                //Actions

                //Reactions

                case 'Send email': {
                    console.log(task);
                    const email = task.params["Email adress"];
                    console.log('email: ', email);
                    let mailOptions = {
                        from: EMAIL_ADRESS,
                        to: email,
                        subject: "test",
                        text: "test"
                    };
                    this._transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                    break;
                }

                default: {
                    throw new Error('Task not supported');
                }
            }
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return value;
    }
}

module.exports = { Email, create_json };