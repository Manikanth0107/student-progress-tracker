const { CronJob } = require('cron');
const dataSync = require('./dataSync');

let job = null;

const isValidCron = (schedule) => {
    try {
        new CronJob(schedule, () => { });
        return true;
    } catch (error) {
        return false;
    }
};

const startJob = (schedule) => {
    if (job) {
        job.stop();
    }
    job = new CronJob(schedule, async () => {
        console.log('Running scheduled data sync');
        await dataSync.syncAllStudents();
    }, null, true, 'UTC');
    job.start();
};

const stopJob = () => {
    if (job) {
        job.stop();
        job = null;
    }
};

module.exports = {
    startJob,
    stopJob,
    isValidCron,
};