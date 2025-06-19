const settingsService = require('../services/settingsService');

exports.getSyncSettings = async (req, res) => {
    try {
        const settings = await settingsService.getSyncSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch sync settings' });
    }
};

exports.updateSyncSettings = async (req, res) => {
    try {
        const { enabled } = req.body;
        const settings = await settingsService.updateSyncSettings({ enabled });
        res.json({ message: 'Sync settings updated', settings });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCronSettings = async (req, res) => {
    try {
        const settings = await settingsService.getCronSettings();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cron settings' });
    }
};

exports.updateCronSettings = async (req, res) => {
    try {
        const { schedule } = req.body;
        const settings = await settingsService.updateCronSettings({ schedule });
        res.json({ message: 'Cron settings updated', settings });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};