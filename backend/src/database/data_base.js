const mongoose = require("mongoose");
require("dotenv").config();
const connectTODB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB");
    }
    catch (e) {
        console.error("Error connecting to MongoDB:", e);
        process.exit(1)
    }
}
module.exports = connectTODB;