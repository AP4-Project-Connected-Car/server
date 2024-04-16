/* -------------------------------------------------------------------------- */
/*                    The class to represent a Log element                    */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const { dbLogger } = require('../utils/logger');

class Log {
    constructor(object, date, type, content) {
        this.date = date;
        this.type = type;
        this.object = object;
        this.content = content;
        this.id = null;    }

    /**
     * Convert the current instance to a JSON object
     * @returns The JSON object
     */
    toJSON() {
        const result = {object: this.object, date: this.date, type: this.type, content: this.content};
        if (this.id !== null) result.id = this.id;
        return result;
    }

    /**
     * Put a new log in the 'logbook' collection
     * @param {DatabaseManager} db The database connection manager
     */
    async insert(db) {
        // Open database connection
        db.connect();

        // Insert the document
        dbLogger.debug(`Inserting a log to the logbook collection (with object "${this.object}")...`);
        const logbook = db.database.collection('logbook');
        const result = await logbook.insertOne(this.toJSON());
        dbLogger.info(`A new log inserted to the logbook collection (with object "${this.object}")`);

        // Update the log id
        this.id = result.insertedId;
    }
    
    /**
     * Get all logs contained in the 'logbook' collection
     * @param {DatabaseManager} db The database connection manager
     * @returns All logs as JSON format
     */
    static async getAllLogs(db) {
        // Open database connection
        db.connect();

        // Query data
        dbLogger.debug(`Getting all logs from the logbook collection...`);
        const logbook = db.database.collection('logbook');
        const allLogs = await logbook.find();
        dbLogger.info(`Logs successfully gotten from the database.`);
        
        // Read all docs
        const result = [];
        for await (const doc of allLogs) result.push(doc);

        return result;
    }

    /**
     * Create a Log instance from a JSON object
     * @param {Object} obj A JSON object
     * @returns The Log instance
     */
    static fromObject(obj) {
        if (!obj.hasOwnProperty('date')) obj.date = new Date().toLocaleDateString('fr-FR').replaceAll('/', '-');
        const result = new Log(obj.object, obj.date, obj.type, obj.content);
        if (obj.hasOwnProperty('id')) result.id = obj.id;
        return result;
    }
}

module.exports = { Log };