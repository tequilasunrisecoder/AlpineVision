const { MongoClient } = require('mongodb');

<<<<<<< HEAD
/*const uri = "mongodb://localhost:27017";*/
const uri = 'mongodb+srv://alpinevision:alpinevision@alpinevision.lwa68lx.mongodb.net/?retryWrites=true&w=majority&appName=AlpineVision';
=======
const uri = "mongodb://localhost:27017";
>>>>>>> main
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let _db;

async function connectToDatabase() {
    try {
        await client.connect();
<<<<<<< HEAD
        console.log("Connesso a MongoDB ATLAS!");
=======
        console.log("Connesso a MongoDB");
>>>>>>> main
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

