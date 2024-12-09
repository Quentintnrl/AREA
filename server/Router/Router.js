module.exports = function() {
    const { login, register } = require('../login.js');
    const express = require('express');
    const getAllServices = require('../getService.js')
    const router = express.Router();

    router.get("/", (req, res) => {
        res.set('Content-Type', 'text/html');
        res.json("Hello world!! Welcome to the AREA");
    });

    router.get("/getServices", (req, res) => {
        console.log("getServices");
        res.set('Content-Type', 'text/html');
        getAllServices.getAllServices()
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
        getAllServices.getAllActions()
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
        getAllServices.getAllReactions()
        .then(services => {
            res.json(services);
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

    return router;
};