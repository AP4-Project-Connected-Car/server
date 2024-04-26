/* -------------------------------------------------------------------------- */
/*                         The WebSocket server class                         */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const WebSocket = require('ws');
const uuid = require('uuid');

const { wsLogger } = require('./logger');

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
        this.server.on('connection', ws => {
            this.onConnection(ws);

            // A message is received
            ws.on('message', msg => this.onMessage(ws, msg));

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
        [...this.clients.keys()].forEach(client => {
            const clientData = this.clients.get(client);
            const sent = {...clientData, message};
            client.send(JSON.stringify(sent));
            wsLogger.info(`Sent to ${clientData.id} : ${sent.message}`);
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
            wsLogger.info(`Received from ${clientData.id} : ${data.message}`);
        } catch (err) {
            wsLogger.warning(`Wrong message received from ${clientData.id}`);
        }

        // Broadcast a message
        this.broadcast('Received !');
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