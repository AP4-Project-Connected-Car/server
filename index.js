/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { httpLogger } = require('./utils/logger');

// Load config file
const config = require('./config.json');

/* ---------------------------- Init HTTP server ---------------------------- */

const app = express();
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

/* ------------------------------- HTTP routes ------------------------------ */

app.get('/', (_req, res) => {
    httpLogger.info('Request for the home page');
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/ping', (_req, res) => {
    httpLogger.info('Ping received');
    res.json({message: 'Pong !', httpCode: 200});
});

/* ---------------------------- Starting servers ---------------------------- */

app.listen(config.server.port, () => httpLogger.info('Server listening on port', config.server.port));