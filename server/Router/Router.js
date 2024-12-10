module.exports = function() {
    const { login, register } = require('../login.js');
    const express = require('express');
    const router = express.Router();
    const get_login_url  = require('../Services/Login_url.js').getLoginLink;

    router.get("/", (req, res) => {
        res.set('Content-Type', 'text/html');
        res.json("Hello world!! Welcome to the AREA");
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

        try {
            const { serviceId } = JSON.parse(body);
            const url = get_login_url(serviceId);
             res.writeHead(201, { 'Content-Type': 'application/json' });
             res.end(JSON.stringify({ url: url }));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });

    return router;
};