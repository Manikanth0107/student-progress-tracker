const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/students');
const emailRoutes = require('./routes/email');
const settingsRoutes = require('./routes/settings');
const { startDataSync } = require('./services/dataSync');

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/students', studentRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/settings', settingsRoutes);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        startDataSync();
    });
});