/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { WebsocketServer } = require('./utils/WebsocketServer');
const { DatabaseManager } = require('./utils/DatabaseManager');
const { httpLogger, wsLogger } = require('./utils/logger');

// Load config file
const config = require('./config.json');
require('dotenv').config();

/* -------------------------------------------------------------------------- */
/*                                 HTTP server                                */
/* -------------------------------------------------------------------------- */

const app = express();
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

// Init the database manager
const db = new DatabaseManager(process.env.MONGO_ROOT_USER, process.env.MONGO_ROOT_PASSWORD, config.db.name);

/* ------------------------------- HTTP routes ------------------------------ */

app.get('/', (_req, res) => {
    httpLogger.info('Request for the home page');
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/ping', (_req, res) => {
    httpLogger.info('Ping received');
    res.json({message: 'Pong !', httpCode: 200});
});

app.get('/test', async (_req, res) => {
    db.connect();

    const result = await db.test();

    await db.close();

    res.json(result);
});

/* -------------------------------------------------------------------------- */
/*                              Starting servers                              */
/* -------------------------------------------------------------------------- */

// HTTP server
const httpPort = process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT) ? process.env.HTTP_PORT : config.server.httpPort;
app.listen(httpPort, () => httpLogger.info(`HTTP server listening on port ${httpPort}`));

// WS server
const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort;
const wss = new WebsocketServer(wssPort, () => wsLogger.info(`WS server listening on port ${wssPort}`));