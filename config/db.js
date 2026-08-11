const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');  // get any of values in json format

// need something to call within server.js
const connectDB = async () => {
    try {
        await mongoose.connect(db);  // returns a promise. Need await here
        console.log("MongoDB Connected...");  // once connected, log it
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);  // exit process with failure
    }
}

module.exports = connectDB;
