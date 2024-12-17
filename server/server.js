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
//     // swaggerUI.serve,S
//     // swaggerUI.setup(swaggerDoc)
// )

app.listen(port, () => {
    console.log('Server app listening on port ' + port);
});
