const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connesso a MongoDB");
        _db = client.db("AlpineVision_");
    } catch (error) {
        console.error("Impossibile connettersi a MongoDB", error);
        process.exit(1);
    }
}

function getDb() {
    if (!_db) {
        throw new Error('La connessione al database non è stata stabilita.');
    }
    return _db;
}

module.exports = {
    connectToDatabase,
    getDb
};

