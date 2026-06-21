const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const uploadRoute = require('./routes/uploadRoute');
const authRoutes = require('./routes/authRoutes');
const connectTODB = require('./database/data_base');

connectTODB();
c
app.use(cors());
app.use(express.json());
app.use('/api', uploadRoute);
app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
    // Determine correct status code
    const status = err.status || err.statusCode || 500;
    const isClientError = status >= 400 && status < 500;
    // Send safe response
    res.status(status).json({
        success: false,
        message: isClientError ? err.message : 'Internal server error'
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
