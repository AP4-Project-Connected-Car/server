/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const { WebsocketServer } = require('./utils/WebsocketServer');
const { DatabaseManager } = require('./db/DatabaseManager');
const { Log } = require('./db/Log');
const { httpLogger, wsLogger } = require('./utils/logger');

const signals = require('./public/JSON/signals.json');

// Load config file
const config = require('./config.json');
require('dotenv').config();

// Define ports
const httpPort = process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT) ? process.env.HTTP_PORT : config.server.httpPort;
const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort;

/* -------------------------------------------------------------------------- */
/*                                 HTTP server                                */
/* -------------------------------------------------------------------------- */

const app = express();
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());

// Init the database manager
const db = new DatabaseManager(process.env.MONGO_ROOT_USER, process.env.MONGO_ROOT_PASSWORD, config.db.name);

/* ------------------------------- HTTP routes ------------------------------ */

app.get('/', (_req, res) => {
    httpLogger.info('Request for the home page');
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/ping', (_req, res) => {
    httpLogger.info('Ping received');
    res.json({ message: 'Pong !', httpCode: 200 });
});

app.get('/port', (_req, res) => {
    res.json({ http: httpPort, ws: wssPort, httpCode: 200 });
});

app.get('/signals', (_req, res) => {
    res.json(signals);
});

app.get('/test', async (_req, res) => {
    db.connect();

    const result = await db.test();

    res.json(result);
});

app.get('/logbook', async (_req, res) => {
    const result = await Log.getAllLogs(db);
    res.json(result);
});

app.post('/logbook', async (req, res) => {
    const log = Log.fromObject(req.body);
    await log.insert(db);
    res.send({ message: 'ok', httpCode: 200 });
});

app.get('/monitoring', async () => {
    res.json({
        battery: { value: (10, 5 + Math.random() * 4), unit: "Volt" },
        odometer: { value: 130000 + Math.random() * 4000, unit: "km" },
        speed: { value: Math.random() * 70, unit: "km/h" }
    });
});

/* -------------------------------------------------------------------------- */
/*                              Starting servers                              */
/* -------------------------------------------------------------------------- */

// HTTP server
app.listen(httpPort, () => httpLogger.info(`HTTP server listening on port ${httpPort}`));

// WS server
const wss = new WebsocketServer(wssPort, () => wsLogger.info(`WS server listening on port ${wssPort}`));
