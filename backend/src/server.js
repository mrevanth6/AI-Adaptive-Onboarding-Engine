const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/uploadRoute');
const authRoutes = require('./routes/authRoutes');
const connectTODB = require('./database/data_base');

connectTODB();

app.use(cors());
app.use(express.json());
app.use('/api', uploadRoute);
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {


    res.status(400).json({
        success: false,
        message: err.message
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});