/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { httpLogger, wsLogger, dbLogger } = require('./utils/logger');
const { seedMongoDB } = require('./utils/dbSeeding');

// Load config file
const config = require('./config.json');
require('dotenv').config();

/* ------------------------------- HTTP routes ------------------------------ */

const app = express();
app.use(bodyParser.json());
app.use(cors({ origin: '*' }));

// Root url
app.get('/', (_req, res) => res.redirect('/api/ping'));

// Import routes
const apiRouter = require('./routes/global/controller');
const monitoringRouter = require('./routes/monitoring/controller');
const signalsRouter = require('./routes/signals/controller');
const logbookRouter = require('./routes/logbook/controller');

// Setup all the routes
app.use('/api', apiRouter);
app.use('/monitoring', monitoringRouter);
app.use('/signals', signalsRouter);
app.use('/logbook', logbookRouter);

app.get('*', (_req, res) => res.status(404).send({ message: 'Nothing on this endpoint', httpCode: 404 }));

/* ------------------------------ Connect to DB ----------------------------- */

const MONGO_URL = `mongodb://${process.env.MONGO_ROOT_USER}:${process.env.MONGO_ROOT_PASSWORD}@mongo:27017/project?authSource=admin`;
mongoose
    .connect(MONGO_URL)
    .then(() => {
        dbLogger.info('Connected to DB!');

        // Seeding the database
        dbLogger.debug('Seeding the DB...');
        seedMongoDB();
    })
    .catch((err) => {
        console.error(err);
    });

/* ---------------------------- Starting servers ---------------------------- */

// Define ports
const httpPort = process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT) ? process.env.HTTP_PORT : config.server.httpPort;
const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort;

// HTTP server
app.listen(httpPort, () => httpLogger.info(`HTTP server listening on port ${httpPort}`));

// WS server
const { WebsocketServer } = require('./ws/WebsocketServer');
const wss = new WebsocketServer(wssPort, () => wsLogger.info(`WS server listening on port ${wssPort}`));
