const { createGzip } = require('zlib');

module.exports = function() {
    const { login, register } = require('../login.js');
    const express = require('express');
    const router = express.Router();
    const get_login_url  = require('../Services/Login_url.js').getLoginLink;
    const { getServiceReactions, getServiceActions, getAllServices, getAllActions, getAllReactions } = require('../getService.js');
    let service_login_user_id = null;
    let service_login_service_id = null;
    const axios = require('axios');
    const querystring = require('querystring');
    const add_user_tokens = require('../Services/ServiceManager.js').add_user_tokens;

    router.get("/", (req, res) => {
        res.set('Content-Type', 'text/html');
        res.json("Hello world!! Welcome to the AREA");
    });

    router.get("/getServices", (req, res) => {
        console.log("getServices");
        res.set('Content-Type', 'text/html');
        getAllServices()
        .then(services => {
            res.json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getActions", (req, res) => {
        console.log("getActions");
        res.set('Content-Type', 'text/html');
        getAllActions()
        .then(services => {
            res.json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getReactions", (req, res) => {
        console.log("getReactions");
        res.set('Content-Type', 'text/html');
        getAllReactions()
        .then(services => {
            res.json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getServiceReactions", (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                console.log("getServiceReactions");
                const { serviceId } = JSON.parse(body);
                console.log(serviceId);
                res.set('Content-Type', 'text/html');
                getServiceReactions(serviceId)
                .then(services => {
                    res.json(services);
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }

        });
    });

    router.get("/getServiceActions", (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                console.log("getServiceActions");
                const { serviceId } = JSON.parse(body);
                res.set('Content-Type', 'text/html');
                getServiceActions(serviceId)
                .then(services => {
                    res.json(services);
                })
                .catch(error => {
                    res.status(500).json({ error: error.message });
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }

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

    router.get("/get_service_login_url", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const { userId, serviceId } = JSON.parse(body);
                service_login_user_id = userId;
                service_login_service_id = serviceId;
                const url = get_login_url(serviceId);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: url }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    });

    router.get('/spotify_callback', async (req, res) => {
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

            res.send('Logged in! Tokens are saved in session.');
        } catch (error) {
            console.error('Error exchanging token:', error.response?.data || error.message);
            res.status(500).send('Authentication failed');
        }
    });

    return router;
};