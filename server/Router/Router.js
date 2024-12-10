let service_login_user_id = null;
let service_login_service_id = null;
const axios = require('axios');
const querystring = require('querystring');
const add_user_tokens = require('../Services/ServiceManager.js').add_user_tokens;

module.exports = function() {
    const { login, register } = require('../login.js');
    const express = require('express');
    const getAllServices = require('../getService.js')
    const router = express.Router();
    const get_login_url  = require('../Services/Login_url.js').getLoginLink;
    const createActionReaction = require('../Services/ServiceManager.js').createActionReaction;

    router.get("/getServices", (req, res) => {
        console.log("getServices");
        res.set('Content-Type', 'text/html');
        getAllServices.getAllServices()
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getActions", (req, res) => {
        console.log("getActions");
        res.set('Content-Type', 'text/html');
        getAllServices.getAllActions()
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getReactions", (req, res) => {
        console.log("getReactions");
        res.set('Content-Type', 'text/html');
        getAllServices.getAllReactions()
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.post("/login", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { userName, password } = JSON.parse(body);
                const loginResult = await login(userName, password);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    token: loginResult.token,
                    userName: loginResult.userName,
                    Id: loginResult.Id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    });

    router.post("/register", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {userEmail, userName, password } = JSON.parse(body);
                const registerResult = await register(userEmail, userName, password);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    token: registerResult.token,
                    userName: registerResult.userName,
                    Id: registerResult.Id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    });

    router.get("/about.json", (req, res) => {
        const ip = req.headers['x-forwarded-for']
                    ? req.headers['x-forwarded-for'].split(',')[0]
                    : req.socket.remoteAddress;

        const ipv4 = ip.startsWith('::ffff:') ? ip.substr(7) : ip;

        res.set('Content-Type', 'application/json');
        getAllServices.getaboutroutes(ipv4)
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getServiceLoginURL", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        try {
            const { userId, serviceId } = JSON.parse(body);
            service_login_user_id = userId;
            service_login_service_id = serviceId;
            const url = get_login_url(serviceId);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url: url }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });

    router.put("/CreateActionReaction", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => { // Mark this function as async
            // Now the body is fully collected, you can log it
            const userId = JSON.parse(body).user_id;
            const actionJson = JSON.parse(body).action;
            const reactionJson = JSON.parse(body).reaction;

            console.log("userId: ", userId);
            console.log("actionJson: ", actionJson);
            console.log("reactionJson: ", reactionJson);

            await createActionReaction(userId, actionJson, reactionJson);

            // Send a response after handling the request
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: "Request received" }));
        });
    });

    router.get('/spotifyCallback', async (req, res) => {
        const code = req.query.code || null;

        try {
            // Exchange the authorization code for access and refresh tokens
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

            // Save tokens in session
            add_user_tokens(service_login_user_id, service_login_service_id, response.data);

            res.status(200).send('Logged in! Tokens are saved in session.');
        } catch (error) {
            console.error('Error exchanging token:', error.response?.data || error.message);
            res.status(500).send('Authentication failed');
        }
    });

    return router;
};