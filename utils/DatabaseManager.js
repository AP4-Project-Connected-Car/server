/* -------------------------------------------------------------------------- */
/*                         The database manager class                         */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Imports -------------------------------- */

const { MongoClient } = require('mongodb');

const { dbLogger } = require('./logger');

/* -------------------------------------------------------------------------- */
/*                              Database manager                              */
/* -------------------------------------------------------------------------- */

class DatabaseManager {
    constructor(username, password, dbName) {
        this.uri = `mongodb://${username}:${password}@mongo:27017`;
        this.databaseName = dbName;

        // Init the Mongo client
        this.client = new MongoClient(this.uri);
    }

    /* --------------------------- Manage Mongo client -------------------------- */

    /**
     * Start the database connection
     */
    connect() {
        this.database = this.client.db(this.databaseName);
        dbLogger.info(`Successfully connected to the database : ${this.databaseName}`);
    }

    /**
     * Close the database connection
     */
    async close() {
        await this.client.close();
        dbLogger.info(`Disconnected to the database : ${this.databaseName}`);
    }

    async test() {
        const batteryStats = this.database.collection('battery');
        const query = { name: 'test' };
        const test = await batteryStats.findOne(query);
        return test;
    }
}

module.exports = { DatabaseManager };