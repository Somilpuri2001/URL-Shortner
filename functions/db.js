const mongoose = require('mongoose');

async function connectToDatabase() {
    try {

        const URL = "mongodb+srv://somil:somil@cluster0.3z100vt.mongodb.net/?retryWrites=true&w=majority";

        await mongoose.connect(URL,{dbName:'urlShortner'});

        console.log("Connected to database");

    } catch (error) {
        console.error("Error connecting to the database ", error.message);
    }
}

module.exports = connectToDatabase;