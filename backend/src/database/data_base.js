const mongoose = require("mongoose");
require("dotenv").config();
const connectTODB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Data Base connected Succesfully");
    }
    catch (e) {
        console.log("Error in connecting to the DataBase");
        process.exit(1)
    }
}
module.exports = connectTODB;