/* -------------------------------------------------------------------------- */
/*                The Battery value representation in database                */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

const Battery = mongoose.Schema({
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

module.exports = mongoose.model('battery', Battery);