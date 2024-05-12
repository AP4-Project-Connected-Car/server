/* -------------------------------------------------------------------------- */
/*      A module to determine what to do when the battery data is updated     */
/* -------------------------------------------------------------------------- */

// Import models
const CoolingLiquidTemp = require("../../models/monitoring/CoolingLiquidTemp");

const { dbLogger } = require('../../utils/logger');

const trunc = (x, d=2) => Math.floor(x * (10**d)) / (10**d);

/**
 * What to do with WS data received
 * @param {WebSocketServer} wss The WebSocket server instance
 * @param {Object} content The received data
 */
function dataReceived(wss, content) {
    new CoolingLiquidTemp(content).save().catch(() => dbLogger.error("Error saving the cooling liquid temperature value..."));
    wss.broadcast(JSON.stringify({for: 'ui', component: 'coolingLiquid', content: { value: trunc(content.value, 1) }}));
}

module.exports = { dataReceived };