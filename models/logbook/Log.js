/* -------------------------------------------------------------------------- */
/*                     The Log representation in database                     */
/* -------------------------------------------------------------------------- */

const mongoose = require('mongoose');

const PostLogSchema = mongoose.Schema({
    object: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
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
    },
});

module.exports = mongoose.model('logbook', PostLogSchema);