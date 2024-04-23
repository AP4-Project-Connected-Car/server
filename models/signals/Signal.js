/* -------------------------------------------------------------------------- */
/*                    The Signal representation in database                   */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

const Signal = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    imgName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
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
});

module.exports = mongoose.model('signals', Signal);