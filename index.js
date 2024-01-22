/* -------------------------------------------------------------------------- */
/*                           The server entry point                           */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');
const uuid = require('uuid');

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

/* -------------------------------- Starting -------------------------------- */

if (process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT))
    app.listen(process.env.HTTP_PORT, () => httpLogger.info(`Server listening on port ${process.env.HTTP_PORT}`));
else
    app.listen(config.server.port, () => httpLogger.info(`Server listening on port ${config.server.port}`));

/* -------------------------------------------------------------------------- */
/*                                  WS server                                 */
/* -------------------------------------------------------------------------- */

const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort
const wss = new WebSocket.Server({ port: wssPort });

const clients = new Map();

/* -------------------------------- WS events ------------------------------- */

wss.on('connection', ws => {
    const id = uuid.v4();
    clients.set(ws, { id });
    wsLogger.debug(`Connected : ${id}`);

    /* ------------------------------ Message event ----------------------------- */

    ws.on('message', messageAsString => {
        const client = clients.get(ws);

        try {
            const data = JSON.parse(messageAsString);
            wsLogger.info(`Received from ${client.id} : ${data.message}`);
        } catch (err) {
            wsLogger.warning(`Wrong message received from ${client.id}`);
        }

        [...clients.keys()].forEach(client => {
            const clientData = clients.get(client);
            const sent = {...clientData, message: "Received !"};
            client.send(JSON.stringify(sent));
            wsLogger.info(`Sent to ${clientData.id} : ${sent.message}`);
        });
    });

    /* ------------------------------- Close event ------------------------------ */

    ws.on("close", () => {
        clients.delete(ws);
        wsLogger.debug(`Disconnected : ${id}`);
    });

});