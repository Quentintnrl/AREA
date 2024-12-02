var express = require('express');
var router = express.Router();

router
   .get("/", (req, res) => {
        res.set('Content-Type', 'text/html');
        res.json("Hello world!! Welcome to the AREA");
    })

module.exports = router;