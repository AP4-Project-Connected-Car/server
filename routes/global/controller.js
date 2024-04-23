/* -------------------------------------------------------------------------- */
/*                              Global API router                             */
/* -------------------------------------------------------------------------- */

const { Router } = require('express');

// Import models
const Battery = require("../../models/monitoring/Battery");
const CoolingLiquidTemp = require("../../models/monitoring/CoolingLiquidTemp");
const Odometer = require("../../models/monitoring/Odometer");

const { httpLogger, dbLogger } = require('../../utils/logger');

// Load config file
const config = require('../../config.json');
require('dotenv').config();

// Setup the express server router
const router = Router();

// Ping the API
router.get('/ping', async (_req, res) => {
    httpLogger.info('GET /api/ping');

    res.json({ message: 'Pong !', httpCode: 200 });
});

// Get HTTP and WS ports
router.get('/ports', (_req, res) => {
    httpLogger.info('GET /api/ports');

    // Define ports
    const httpPort = process.env.HTTP_PORT && parseInt(process.env.HTTP_PORT) ? process.env.HTTP_PORT : config.server.httpPort;
    const wssPort = process.env.WS_PORT && parseInt(process.env.WS_PORT) ? process.env.WS_PORT : config.server.wsPort;
    
    res.json({ http: httpPort, ws: wssPort, httpCode: 200 });
});

// Test route
router.get('/test', async (_req, res) => {
    try {
        httpLogger.info('GET /api/test');
        const result = [];
    
        let tmp = await new Battery({value: 13}).save();
        result.push(tmp);
        dbLogger.info('New Battery item inserted');
    
        tmp = await new Odometer({value: 150000, distanceSinceLastHour: 40}).save();
        result.push(tmp);
        dbLogger.info('New Odometer item inserted');
    
        tmp = await new CoolingLiquidTemp({value: 20}).save();
        result.push(tmp);
        dbLogger.info('New CoolingLiquidTemp item inserted');
    
        res.json({ data: result, httpCode: 200 });
    } catch (err) {
        httpLogger.warn("POST /api/test Response error");
        res.status(500).json({ message: err, httpCode: 500 });
        console.error(err);
    }
});

// Export the router
module.exports = router;