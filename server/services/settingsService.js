const Settings = require('../models/Settings');
const CronJobManager = require('./cronJobManager');

const initializeSettings = async () => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = new Settings({
            sync: { enabled: true },
            cron: { schedule: '0 2 * * *' }, 
        });
        await settings.save();
    }
    return settings;
};

const getSyncSettings = async () => {
    const settings = await initializeSettings();
    return settings.sync;
};

const updateSyncSettings = async ({ enabled }) => {
    if (typeof enabled !== 'boolean') {
        throw new Error('Enabled must be a boolean');
    }
    const settings = await Settings.findOneAndUpdate(
        {},
        { 'sync.enabled': enabled },
        { new: true, upsert: true }
    );
    if (enabled) {
        CronJobManager.startJob(settings.cron.schedule);
    } else {
        CronJobManager.stopJob();
    }
    return settings.sync;
};

const getCronSettings = async () => {
    const settings = await initializeSettings();
    return settings.cron;
};

const updateCronSettings = async ({ schedule }) => {
    if (!schedule || !CronJobManager.isValidCron(schedule)) {
        throw new Error('Invalid cron schedule');
    }
    const settings = await Settings.findOneAndUpdate(
        {},
        { 'cron.schedule': schedule },
        { new: true, upsert: true }
    );
    if (settings.sync.enabled) {
        CronJobManager.startJob(schedule);
    }
    return settings.cron;
};

module.exports = {
    getSyncSettings,
    updateSyncSettings,
    getCronSettings,
    updateCronSettings,
};