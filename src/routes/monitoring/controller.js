/* -------------------------------------------------------------------------- */
/*                              Monitoring router                             */
/* -------------------------------------------------------------------------- */

// Import dependencies
const { Router } = require('express');

// Import models
const Battery = require("../../models/monitoring/Battery");
const CoolingLiquidTemp = require("../../models/monitoring/CoolingLiquidTemp");
const Odometer = require("../../models/monitoring/Odometer");

const { httpLogger, dbLogger } = require('../../utils/logger');

// Setup the express server router
const router = Router();

// Get current logs from database
router.get('/', async (_req, res) => {
    try {
        // Get last values
        const lastBatteryValue = await Battery.findOne().sort({createdAt: -1}).exec();
        const lastCoolingLiquidTempValue = await CoolingLiquidTemp.findOne().sort({createdAt: -1}).exec();
        const lastOdometerValue = await Odometer.findOne().sort({createdAt: -1}).exec();

        const result = {
            battery: { name: "Battery", value: lastBatteryValue.value, unit: "V" },
            odometer: { name: "Odometer", value: lastOdometerValue.value, unit: "km" },
            speed: { name: "Speed", value: 0, unit: "km/h" },
            coolingLiquid: { name: "Cooling Liquid", value: lastCoolingLiquidTempValue.value, unit: "°C" }
        };
        res.json(result);
    } catch (err) {
        httpLogger.warn("GET /monitoring Response error");
        res.status(500).json({ message: err, httpCode: 500 });
        console.error(err);
    }
});

// Export the router
module.exports = router;