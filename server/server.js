const express = require('express');
const router = require('./Router/Router.js');
const app = express();
const port = 8000;

app.use('/', router);
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});