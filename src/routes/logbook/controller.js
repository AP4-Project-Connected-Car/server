/* -------------------------------------------------------------------------- */
/*                               Logbook router                               */
/* -------------------------------------------------------------------------- */

// Import middlewares
const { body, validationResult } = require("express-validator");

// Import dependencies
const { Router } = require('express');

// Import models
const Log = require("../../models/logbook/Log");

const { httpLogger, dbLogger } = require('../../utils/logger');

// Setup the express server router
const router = Router();

// Get current logs from database
router.get('/', async (_req, res) => {
    try {
        httpLogger.info('GET /logbook');
        const data = await Log.find({});
        res.json(data);
    } catch (err) {
        httpLogger.warn("GET /logbook Response error");
        res.status(500).json({ message: err, httpCode: 500 });
        console.error(err);
    }
});

// Post to insert new log
router.post('/',
    body('object').isString(), // Validator
    body('content').isString(), // Validator
    body('type').isNumeric(), // Validator
    async (req, res) => {
        httpLogger.info('POST /logbook');

        // Verify body data
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            httpLogger.warn("POST /logbook Request error");
            return res.status(400).json({ errors: errors.array() });
        }

        // Create new log collection 
        const log = new Log({
            object: req.body.object,
            content: req.body.content,
            type: req.body.type,
        });

        try {
            const savedLog = await log.save();
            dbLogger.info(`New logbook saved with id ${savedLog._id}`);
            res.json(savedLog);
        } catch (err) {
            httpLogger.warn("POST /logbook Response error");
            res.status(500).json({ message: err, httpCode: 500 });
            console.error(err);
        }
    },
);

// Export the router
module.exports = router;