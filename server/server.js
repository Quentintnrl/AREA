require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Router/Router.js');
const pool = require('./db').close;
// const YAML = require('yamljs')
// const swaggerDoc = YAML.load('./Router/swagger.yml')
// const swaggerUI = require('swagger-ui-express')

const app = express();
const port = 8080;

app.use(cors());
app.use('/', router());
// app.use(
//     "/api-docs",
//     // swaggerUI.serve,
//     // swaggerUI.setup(swaggerDoc)
// )

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});

/*const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

// Replace these with your actual Spotify app credentials
const CLIENT_ID = '4626520233864aa3b185c01bf536be35';
const CLIENT_SECRET = '7dd3e8591b9e43de99d191221e0b488e';
const REDIRECT_URI = 'http://localhost:8080/spotify_callback'; // Must match the redirect URI in Spotify app settings

// Step 1: Redirect to Spotify Authorization
app.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?` +
        querystring.stringify({
            response_type: 'code',
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
        });
    res.redirect(authUrl);
});

// Step 2: Handle Spotify Callback and Get Access Token
app.get('/spotify_callback', async (req, res) => {
    const code = req.query.code || null;

    if (!code) {
        return res.status(400).send('Authorization code missing');
    }

    try {
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                },
            }
        );

        const { access_token, refresh_token } = tokenResponse.data;
        console.log(access_token);
        console.log(refresh_token);

        res.json({
            access_token,
            refresh_token,
        });
    } catch (error) {
        console.error('Error fetching access token:', error.response?.data || error.message);
        res.status(500).send('Failed to get access token');
    }
});

// Start the server
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});*/
