const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');
const nodemailer = require('nodemailer');


// Email login
const EMAIL_ADRESS = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Weather API url and key
const apiKey = process.env.WEATHER_API_KEY;
const baseUrl = 'http://api.weatherapi.com/v1/current.json';




//                                                                                  FUNCTIONS UTILS

/**
 * Fetches the current temperature for a given city using WeatherAPI.
 * @param {string} city - The name of the city.
 * @returns {Promise<string>} - The current temperature in Celsius.
 */
async function getTemperatureOfCity(city) {
    if (!city) {
      throw new Error('City name is required');
    }

    try {
      const response = await axios.get(baseUrl, {
        params: {
          key: apiKey,
          q: city,
        },
      });

      const temperature = response.data.current.temp_c; // Temperature in Celsius
      return `${temperature} °C`;
    } catch (error) {
      console.error('Error fetching temperature:', error.message);
      throw new Error('Could not fetch temperature data');
    }
}





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

            case 'Today temperature': {
                console.log(request_json);
                const email = request_json.params["Email adress"];
                console.log('email:', email);
                const city = request_json.params["City"];
                console.log('city:', city);
                const json = {
                    id: request_json.id,
                    params: {
                        "email_adress": email,
                        "city": city
                    }
                };
                return json;
                break;
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

class Weather extends AbstractService {
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
        console.log('Weather service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        if (task instanceof Task) {
            console.log(`Weather service is doing task: ${task.name}`);

            switch (task.name) {

                //Actions

                //Reactions
                case 'Today temperature': {
                    console.log(task);
                    const email = task.params["email_adress"];
                    console.log('email:', email);
                    const city = task.params["city"];
                    console.log('city:', city);
                    const temperature = await getTemperatureOfCity(city);
                    console.log('Temperature:', temperature);
                    //get date
                    const date = new Date();
                    console.log('Date:', date);
                    const day = date.getDate();
                    console.log('Day:', day);
                    //get day name
                    const day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    const day_name = day_names[date.getDay()];
                    console.log('day_name:', day_name);
                    const month = date.getMonth() + 1;
                    console.log('Month:', month);
                    //get month name
                    const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const month_name = month_names[month - 1];
                    console.log('month_name:', month_name);
                    const year = date.getFullYear();
                    console.log('Year:', year);
                    const subject = day + '/' + month + '/' + year + ' temperature';
                    console.log('subject:', subject);
                    const message = 'Today we are the ' + day_name + ' ' + day + 'th ' + month_name + ' ' + year + ' and the temperature in ' + city + ' is ' + temperature + ' !';
                    console.log('message:', message);
                    let mailOptions = {
                        from: EMAIL_ADRESS,
                        to: email,
                        subject: subject,
                        text: message,
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
            }
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return value;
    }
}

module.exports = { Weather, create_json };