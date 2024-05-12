/* -------------------------------------------------------------------------- */
/*      A module to determine what to do when the battery data is updated     */
/* -------------------------------------------------------------------------- */

// Import models
const Odometer = require("../../models/monitoring/Odometer");

const { dbLogger } = require('../../utils/logger');

const seeding = require('../../utils/dbSeed.json');
const config = require('../../config.json');

let ts = new Date();
let lastEntry = {
    _id: null
}

const trunc = (x, d=2) => Math.floor(x * (10**d)) / (10**d);

/**
 * What to do with WS data received
 * @param {WebSocketServer} wss The WebSocket server instance
 * @param {Object} content The received data
 */
function dataReceived(wss, content) {
    const currrentTS = new Date();
    const traveledDistance = content.value * config.car.wheel_circumference;
    
    if ((currrentTS - ts) / (3.6 * (10**6)) >= 1) {
        // If an hour has passed, insert a new entry to the DB
        ts = currrentTS;

        const newEntry = {
            value: lastEntry.value + traveledDistance,
            distanceSinceLastHour: traveledDistance
        }
        new Odometer(newEntry)
            .save()
                .then(savedEntry => lastEntry = savedEntry)
                .catch(() => dbLogger.error("Error saving the new odometer value..."));
    } else {
        // Else we just edit the last entry

        // Init the process at start
        if (lastEntry._id === null) {
            new Odometer({ value: seeding["models/monitoring/Odometer"][0].value, distanceSinceLastHour: seeding["models/monitoring/Odometer"][0].distanceSinceLastHour })
                .save()
                    .then(savedEntry => lastEntry = savedEntry)
                    .catch(() => dbLogger.error("Error saving the odometer value..."));
            return;
        }

        const newEntry = {
            value: lastEntry.value + traveledDistance,
            distanceSinceLastHour: lastEntry.distanceSinceLastHour + traveledDistance
        }
        Odometer.updateOne({}, {...newEntry, updatedAt: Date.now()})
            .then(() => {
                lastEntry = {
                    ...lastEntry,
                    value: newEntry.value,
                    distanceSinceLastHour: newEntry.distanceSinceLastHour
                };
            })
            .catch(() => dbLogger.error("Error editing the odometer value..."));
    }

    // Send the full distance to the UI
    wss.broadcast(JSON.stringify({for: 'ui', component: 'odometer', content: { value: trunc(lastEntry.value / 100) }}));

    // Send the speed to the UI
    wss.broadcast(JSON.stringify({for: 'ui', component: 'speed', content: { value: trunc(traveledDistance/1000*36, 0) }}));
}

module.exports = { dataReceived };