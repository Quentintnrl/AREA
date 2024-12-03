const express = require('express');
const {login} = require('../login.js');
var router = express.Router();

router
   .get("/", (req, res) => {
        res.set('Content-Type', 'text/html');
        res.json("Hello world!! Welcome to the AREA");
    })

    .post("/login", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            console.log("HELLO IN THE LOGIN ROUTE");
            try {
                const { userId, password } = JSON.parse(body);
                const loginResult = await login.login(userId, password, pool);
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
    })

    .post("/register", async (req, res) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const {userEmail, userName, password } = JSON.parse(body);
                console.log("HELLO IN THE REGISTER ROUTE and the body is: ", body);
                const loginResult = await login.register(userEmail, userName, password, pool);
                res.writeHead(201, { 'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    token: loginResult.token,
                    Id: loginResult.Id,
                    userName: loginResult.userName
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json'});
                res.end(JSON.stringify({ error: error.message }));
            }
        });
    })

module.exports = router;