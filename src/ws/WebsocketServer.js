/* -------------------------------------------------------------------------- */
/*                         The WebSocket server class                         */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const WebSocket = require('ws');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

// Import all components modules
const componentsDir = path.join(__dirname, 'components');
const componentsFiles = fs.readdirSync(componentsDir);
const components = componentsFiles.reduce((obj, file) => {
    obj[file.replace('.js', '')] = require('./' + path.join('components', file));
    return obj;
}, {});

const { wsLogger } = require('../utils/logger');
const { error } = require('console');

/* -------------------------------------------------------------------------- */
/*                                  WS server                                 */
/* -------------------------------------------------------------------------- */

class WebsocketServer {
    /**
     * Init the server
     * @param {Number} port The port to listen
     * @param {Function} callback The function to run the init
     */
    constructor(port, callback) {
        this.port = port;

        // Init server
        this.server = new WebSocket.Server({ port });
        this.clients = new Map();

        // Init events
        this.server.on('connection', (ws) => {
            this.onConnection(ws);

            // A message is received
            ws.on('message', (msg) => this.onMessage(ws, msg));

            // The client leaves
            ws.on('close', () => this.onClose(ws));
        });

        // Run the "after init" script
        callback();
    }

    /**
     * Broadcast a message to all connected clients
     * @param {String} message The message to send
     */
    broadcast(message) {
        wsLogger.info(`Broadcasting : ${message}`);
        [...this.clients.keys()].forEach((client) => {
            const clientData = this.clients.get(client);
            const sent = { ...clientData, message };
            client.send(JSON.stringify(sent));
            wsLogger.debug(`Sent to ${clientData.id} : ${sent.message}`);
        });
    }

    /* -------------------------------------------------------------------------- */
    /*                                   Events                                   */
    /* -------------------------------------------------------------------------- */

    /**
     * A new WebSocket connection is triggered
     * @param {WebSocketConnection} ws The current WebSocket connection
     */
    onConnection(ws) {
        const id = uuid.v4();
        const clientData = { id };
        this.clients.set(ws, clientData);
        wsLogger.info(`Connected : ${id}`);
        return clientData;
    }

    /**
     * A message is received
     * @param {WebSocketConnection} ws The current WebSocket connection
     * @param {String} messageAsString The received message
     */
    onMessage(ws, messageAsString) {
        const clientData = this.clients.get(ws);

        // Parse message data
        try {
            const data = JSON.parse(messageAsString);
            if (data.for === 'server') {
                wsLogger.info(`Received message from ${clientData.id} : ${data.component}`);
                components[data.component].dataReceived(this, data.content);
            }
        } catch (err) {
            console.error(err);
            wsLogger.warn(`Wrong message received from ${clientData.id}`);
        }
    }

    /**
     * The client leaves
     * @param {WebSocketConnection} ws The current WebSocket connection
     */
    onClose(ws) {
        const { id } = this.clients.get(ws);
        this.clients.delete(ws);
        wsLogger.info(`Disconnected : ${id}`);
    }
}

module.exports = { WebsocketServer };
