/* -------------------------------------------------------------------------- */
/*      A module to determine what to do when the battery data is updated     */
/* -------------------------------------------------------------------------- */

// Import models
const Battery = require("../../models/monitoring/Battery");

const { dbLogger } = require('../../utils/logger');

const trunc = (x, d=2) => Math.floor(x * (10**d)) / (10**d);

/**
 * What to do with WS data received
 * @param {WebSocketServer} wss The WebSocket server instance
 * @param {Object} content The received data
 */
function dataReceived(wss, content) {
    new Battery(content).save().catch(() => dbLogger.error("Error saving the battery value..."));
    wss.broadcast(JSON.stringify({for: 'ui', component: 'battery', content: { value: trunc(content.value, 2) }}));
}

module.exports = { dataReceived };