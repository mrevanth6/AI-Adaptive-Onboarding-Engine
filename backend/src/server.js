const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/uploadRoute');
app.use(cors());
app.use(express.json());
app.use('/api', uploadRoute);


const POST = process.env.PORT || 3000;
app.listen(POST, () => {
    console.log(`Server is running on port ${POST}`);
});