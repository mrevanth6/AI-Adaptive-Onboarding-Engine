const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/uploadRoute');

app.use(express.json());
app.use('/api', uploadRoute);
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});