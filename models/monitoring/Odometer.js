/* -------------------------------------------------------------------------- */
/*                The Odometer value representation in database               */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

const Odometer = mongoose.Schema({
    distanceSinceLastHour: {
        type: Number,
        required: true,
    },
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

module.exports = mongoose.model('odometer', Odometer);