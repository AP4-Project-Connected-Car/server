/* -------------------------------------------------------------------------- */
/*                     A module to init the logger object                     */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const winston = require('winston');
const { combine, timestamp, label, printf } = winston.format;

// Load config file
const config = require('../config.json');
require('dotenv').config();

/* ------------------------------- Logger init ------------------------------ */

const filename = process.cwd() +  '/' + config.logger.path;

const format = printf(({ level, message, label, timestamp }) => {
    return `[${label}] ${new Date(timestamp).toLocaleString()} <${level}> ${message}`;
});

const transports = [new winston.transports.Console(), new winston.transports.File({ filename, name:"medley" })];

/* ------------------------------- HTTP logger ------------------------------ */

const httpFilename = process.cwd() +  '/' + config.logger.http.path;

const httpLogger = winston.createLogger({
    level: process.env.LOGGER_LEVEL,
    format: combine(label({ label: config.logger.http.label }), timestamp(), format),
    transports: [...transports, new winston.transports.File({ filename: httpFilename, name:"http" })],
});

/* -------------------------------- WS logger ------------------------------- */

const wsFilename = process.cwd() +  '/' + config.logger.ws.path;

const wsLogger = winston.createLogger({
    level: process.env.LOGGER_LEVEL,
    format: combine(label({ label: config.logger.ws.label }), timestamp(), format),
    transports: [...transports, new winston.transports.File({ filename: wsFilename, name:"ws" })],
});

/* ----------------------------- Database logger ---------------------------- */

const dbFilename = process.cwd() +  '/' + config.logger.db.path;

const dbLogger = winston.createLogger({
    level: process.env.LOGGER_LEVEL,
    format: combine(label({ label: config.logger.db.label }), timestamp(), format),
    transports: [...transports, new winston.transports.File({ filename: dbFilename, name:"db" })],
});

/* --------------------------------- Exports -------------------------------- */

module.exports = { httpLogger, wsLogger, dbLogger };