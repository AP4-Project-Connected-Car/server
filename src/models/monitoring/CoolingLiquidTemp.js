/* -------------------------------------------------------------------------- */
/*       The Cooling Liquid temperature value representation in database      */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

const CoolingLiquidTemp = mongoose.Schema({
    value: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

module.exports = mongoose.model('cooling_liquid_temp', CoolingLiquidTemp);