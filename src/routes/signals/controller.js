/* -------------------------------------------------------------------------- */
/*                               Signals router                               */
/* -------------------------------------------------------------------------- */

const { Router } = require('express');

// Import models
const Signal = require("../../models/signals/Signal");

const { httpLogger, dbLogger } = require('../../utils/logger');

// Setup the express server router
const router = Router();

// Get signals list
router.get('/', async (_req, res) => {
    try {
        httpLogger.info('GET /signals')
        const data = await Signal.find({});
        res.json({data, httpCode: 200});
    } catch (err) {
        httpLogger.warn("GET /signals Response error");
        res.status(500).json({ message: err, httpCode: 500 });
        console.error(err);
    }
});

// Export the router
module.exports = router;