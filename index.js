/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { WebsocketServer } = require('./utils/WebsocketServer');
const { httpLogger, wsLogger } = require('./utils/logger');

// Load config file
const config = require('./config.json');

/* -------------------------------------------------------------------------- */
/*                                 HTTP server                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/*                              Starting servers                              */
/* -------------------------------------------------------------------------- */

// HTTP server
const httpPort = process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT) ? process.env.HTTP_PORT : config.server.httpPort;
app.listen(httpPort, () => httpLogger.info(`HTTP server listening on port ${httpPort}`));

// WS server
const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort;
const wssCallback = () => wsLogger.info(`WS server listening on port ${wssPort}`);
const wss = new WebsocketServer(wssPort, wssCallback);