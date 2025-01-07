require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Router/Router.js');
const pool = require('./db').connection;
// const pool = require('./db').close;
const { ServiceManager } = require('./Services/ServiceManager');

let serviceManager = new ServiceManager();
serviceManager.init();

async function serviceManagerLoop() {
    while (true) {
        console.log('SERVICE MANAGER LOOP');
        const [action_reactions] = await pool.query('SELECT * FROM action_reaction');
        for (let i = 0; i < action_reactions.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                console.log(action_reactions[i]);
                const user_id = action_reactions[i].user_id;
                console.log(user_id);
                const action = action_reactions[i].action;
                console.log(action);
                const actionId = action.id;
                console.log(actionId);
                const actionParam = action.params;
                console.log('action params', actionParam);
                if (await serviceManager.checkAction(user_id, actionParam, actionId, action_reactions[i].id)) {
                    console.log('Action is valid');
                    const reaction = action_reactions[i].reaction;
                    console.log(reaction);
                    const reactionParam = reaction.params;
                    console.log('reaction params', reactionParam);
                    const reactionId = reaction.id;
                    console.log(reactionId);
                    await serviceManager.executeReaction(user_id, reactionParam, reactionId, action_reactions[i].id);
                }
                // return;
            } catch (error) {
                console.error('Error fetching data from actions table:', error);
                throw new Error('Could not fetch actions data.');
            }
            continue;
            const reaction = action_reactions[i].reaction;
            console.log(reaction);
        }
    }
}

const YAML = require('yamljs')
const swaggerDoc = YAML.load('./Router/swagger.yml')
const swaggerUI = require('swagger-ui-express')

const app = express();
const port = 8080;

app.use(cors());
app.use('/', router());
app.use(
        "/api-docs",
        swaggerUI.serve,
        swaggerUI.setup(swaggerDoc)
    )

app.listen(port, () => {
    console.log('Server app listening on port ' + port);

    // Run the loop in parallel using Parallel.js
    // serviceManagerLoop();
});

/*const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

const CLIENT_ID = '4626520233864aa3b185c01bf536be35'; // Replace with your Client ID
const CLIENT_SECRET = '7dd3e8591b9e43de99d191221e0b488e'; // Replace with your Client Secret
const REDIRECT_URI = 'http://localhost:8080/spotify_callback'; // Redirect URI you set in your Spotify app

// Step 1: Redirect to Spotify login
app.get('/login', (req, res) => {
    const scopes = 'user-read-playback-state user-modify-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scopes,
        redirect_uri: REDIRECT_URI,
    })}`;

    res.redirect(authUrl);
});

// Step 2: Spotify callback to handle authorization code
app.get('/spotify_callback', async (req, res) => {
    const code = req.query.code || null;

    try {
        // Exchange authorization code for tokens
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                code,
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        // Print tokens to the console
        console.log('Access Token:', response.data.access_token);
        console.log('Refresh Token:', response.data.refresh_token);

        res.send('You are logged in! Check the console for tokens.');
    } catch (error) {
        console.error('Error exchanging token:', error.response?.data || error.message);
        res.send('Error occurred while logging in.');
    }
});

// Start the server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});*/
