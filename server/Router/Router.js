const { createGzip } = require('zlib');
const store = require("store");
const pool = require('../db').connection;
require('dotenv').config();
const jwt = require('jsonwebtoken');


module.exports = function() {
    const { login, register } = require('../login.js');
    const express = require('express');
    const router = express.Router();
    const get_login_url  = require('../Services/Login_url.js').getLoginLink;
    const { getServiceReactions, getServiceActions, getAllServices, getAllActions, getAllReactions, getAREAs, getaboutroutes } = require('../getService.js');
    let service_login_user_id = null;
    let service_login_service_id = null;
    const axios = require('axios');
    const querystring = require('querystring');
    const add_user_tokens = require('../Services/ServiceManager.js').add_user_tokens;
    const createActionReaction = require('../Services/ServiceManager.js').createActionReaction;
    const create_json = require('../Services/ServiceManager.js').create_json;
    const { ActionOrReaction } = require('../Services/ServiceManager.js').ActionOrReaction;

    // Spotify API Credentials
    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
    const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;




//                                                                               GET ROUTES

    router.post("/auth/google", async (req, res) => {
        console.log('Received Google login request');
    
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            // console.log("the body is ", body);
            const { token } = JSON.parse(body)
            
            if (!token) {
                return res.status(400).json({ message: 'Token is required' });
            }
            // console.log(token);

            try {
                // Verify the Google token
                const googleResponse = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
                const googleUser = googleResponse.data;

                // Check if user exists in the database
                let [user] = await pool.query('SELECT * FROM users WHERE email = ?', [googleUser.email]);

                console.log("user: ", googleUser);

                if (user.length === 0) {
                    console.log("in the user creation",);
                    const registerResult = await register(googleUser.email, googleUser.name, googleUser.sub);
                    store.set('id', registerResult.Id);
                    const json = [{
                        id: registerResult.Id,
                        username: registerResult.userName,
                        email: registerResult.email
                    }]
                    console.log(json)
                    res.status(201).json({
                        token: registerResult.token,
                        user: json
                    });
                    return;
                }

                // Create JWT token
                const jwtToken = jwt.sign(
                    { userId: user.id, email: user.email },
                    'your-secret-key', // Secret for signing the JWT
                    { expiresIn: '1h' }
                );

                // Send back the JWT token to the client
                console.log('Generated JWT token:', jwtToken);
                console.log('User:', user);
                res.status(200).json({ token: jwtToken, user });
            } catch (err) {
                console.error('Error verifying Google token:', err);
                res.status(500).json({ message: 'Token verification failed' });
            }
        });
    });

    router.get("/getServices", (req, res) => {
        console.log("getServices");
        res.set('Content-Type', 'text/html');
        getAllServices()
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
        getAllActions()
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
        getAllReactions()
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getServiceActions/:serviceId", (req, res) => {
        try {
            console.log("getServiceActions");
            const serviceId = req.url.split('/getServiceActions/')[1];
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

    router.get("/getServiceReactions/:serviceId", (req, res) => {
        try {
            console.log("getServiceReactions");
            const serviceId = req.url.split('/getServiceReactions/')[1];
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

    router.get('/spotify_callback', async (req, res) => {
        console.log('Spotify callback');
        const code = req.query.code || null;

        const [serviceId] = await pool.query('SELECT id FROM services WHERE name = "Spotify"');

        console.log('Service ID:', serviceId);
        if (serviceId.length === 0) {
            console.error('Service not found');
            res.status(500).send('Service not found');
            return;
        }

        try {
            // Exchange the authorization code for access and refresh_tokens
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
            add_user_tokens(store.get("id"), serviceId[0].id, response.data);

            res.status(200).send('Logged in! Tokens are saved in session.');
        } catch (error) {
            console.error('Error exchanging token:', error.response?.data || error.message);
            res.status(500).send('Authentication failed');
        }

    });

    router.get("/isUserLogin/:serviceId/:id", async (req, res) => {
        console.log("isUserLogin");
        try {
            const serviceId = req.params.serviceId;
            const userId = req.params.id;
            console.log("store.get('id'): ", userId);
            const [token] = await pool.query('SELECT connect_token FROM users_services_login WHERE user_id = ? and service_id = ?', [userId, serviceId]);
            console.log("serviceId: ", serviceId);

            if (token.length !== 0) {
                console.log("isUserLogin");
                return res.status(200).json({login: true});
            } else {
                return res.status(200).json({login: false});
            }
        } catch (error) {
            res.set('Content-Type', 'text/html');
            res.status(500).send('Error fetching data from users_services_login table');
        }
        }
    );

    router.get("/about.json", (req, res) => {
        const ip = req.headers['x-forwarded-for']
                    ? req.headers['x-forwarded-for'].split(',')[0]
                    : req.socket.remoteAddress;

        const ipv4 = ip.startsWith('::ffff:') ? ip.substr(7) : ip;

        res.set('Content-Type', 'application/json');
        getaboutroutes(ipv4)
        .then(services => {
            res.status(200).json(services);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
    });

    router.get("/getServiceLoginURL/:userId/:serviceId", async (req, res) => {
        const userId = req.params.userId;
        const serviceId = req.params.serviceId;

        try {
            console.log("the element is getServiceLoginURL");
            service_login_user_id = userId;
            service_login_service_id = serviceId;
            const url = await get_login_url(serviceId);
            console.log("THE URL IS= ", url);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url: url }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });

    router.get("/getAREAs/", async (req, res) => {
        try {
            console.log("IN getAREAS")
            getAREAs()
            .then(areas => {
                res.status(200).json(areas);
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });

    router.get("/getAREA/:id", async (req, res) => {
        try {
            console.log("IN getAREA")
            const id = req.params.id;
            const [AREA] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', [id]);
            return res.status(200).json({action: AREA});
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });

    router.get("/getAction/:id", async (req, res) => {
        console.log("GET ACTION BY ID");
        try {
            const id = req.params.id;
            const [action] = await pool.query('SELECT * FROM actions WHERE id = ?', [id]);
            return res.status(200).json({action: action});
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: error }));
        }
    });

    router.get("/getReaction/:id", async (req, res) => {
        console.log("GET REACTION BY ID");
        try {
            const id = req.params.id;
            const [reaction] = await pool.query('SELECT * FROM reactions WHERE id = ?', [id]);
            return res.status(200).json({reaction: reaction});
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: error }));
        }
    });

    router.get("/getUserInfo/", async (req, res) => {
        console.log("GET USER INFO BY ID");
        try {
            const [info] = await pool.query('SELECT username, email FROM users WHERE id = ?', [store.get("id")]);
            return res.status(200).json({info: info});
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: error }));
        }
    });

    //                                                                               POST ROUTES

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
                store.set('id', loginResult.Id);
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
                store.set('id', registerResult.Id);
                res.status(201).json({
                    token: registerResult.token,
                    userName: registerResult.userName,
                    Id: registerResult.Id
                });
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    });

    router.post("/CreateActionReaction", async (req, res) => {
        console.log("IN THE ACTION REACTION");
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => { // Mark this function as async
            // Now the body is fully collected, you can log it
            try {

                //front and mobile request read
                const userId = JSON.parse(body).JsonReponse.user_id;
                const actionJson = await create_json(JSON.parse(body).JsonReponse.action, userId, "action");
                const reactionJson = await create_json(JSON.parse(body).JsonReponse.reaction, userId, "reaction");
                // console.log("Received body:", body);

                //postman request read
                // const userId = JSON.parse(body).user_id;
                // const actionJson = await create_json(JSON.parse(body).action, userId, "action");
                // const reactionJson = await create_json(JSON.parse(body).reaction, userId, "reaction");

                console.log("userId: ", userId);
                console.log("actionJson: ", actionJson);
                console.log("reactionJson: ", reactionJson);

                if (actionJson === undefined || reactionJson === undefined) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Cannot create the Action-reaction -> Bad parameters" }));
                    return;
                }
                await createActionReaction(userId, actionJson, reactionJson);

                // Send a response after handling the request
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Action-reaction created" }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Cannot create the Action-reaction" }));
            }
        });
    });





//                                                                               PUT ROUTES

    return router;
};