const { dbLogger } = require('./logger');

async function seedMongoDB() {
    const seeds = require('./dbSeed.json');
    for (const collection in seeds) {
        const Model = require('../' + collection);
        const existingData = await Model.find({});
        
        // Seed the collection if it's empty
        if (existingData.length === 0) {
            const collectionName = collection.split('/').slice(-1);
            dbLogger.info(`Seeding the model ${collectionName} ...`);
            const currentSeed = seeds[collection];

            // Add each seed document
            for (const seed of currentSeed) {
                const toAdd = new Model(seed);
                const savedSeed = await toAdd.save();
                dbLogger.info(`New seed for model ${collectionName} saved with id ${savedSeed._id}`);
            }
        }
    }
}

module.exports = { seedMongoDB };