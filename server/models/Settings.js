const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    sync: {
        enabled: {
            type: Boolean,
            default: true,
        },
    },
    cron: {
        schedule: {
            type: String,
            default: '0 2 * * *', 
        },
    },
});

module.exports = mongoose.model('Settings', settingsSchema);