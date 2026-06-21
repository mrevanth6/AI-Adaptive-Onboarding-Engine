const mongoose = require("mongoose");
require("dotenv").config();
const connectTODB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

    }
    catch (e) {

        process.exit(1)
    }
}
module.exports = connectTODB;