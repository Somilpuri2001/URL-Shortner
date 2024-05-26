const mongoose = require('mongoose');

function databaseSchema() {
    try {
        const urlSchema = new mongoose.Schema({
            urlId: {
                type: String,
                required: true,
            },
            orignalUrl: {
                type: String,
                required: true
            },
            shortUrl: {
                type: String,
                required: true
            },
            visitCount: {
                type: Number,
                required: true,
                default: 0
            }
        })
        
    }
    catch (error) {
        console.error("Failed to create schema", error.message);
    }
}

module.exports = databaseSchema;