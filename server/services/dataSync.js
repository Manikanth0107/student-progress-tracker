const { CronJob } = require('cron');
const Student = require('../models/Student');
const { fetchUserContests } = require('./codeforcesAPI');

const syncStudentData = async () => {
    try {
        const students = await Student.find();
        console.log(`Syncing data for ${students.length} students`);
        for (const student of students) {
            try {
                const contests = await fetchUserContests(student.codeforcesHandle);
                if (contests.length > 0) {
                    const latestContest = contests[contests.length - 1];
                    student.currentRating = latestContest.newRating || 0;
                    student.maxRating = Math.max(...contests.map(c => c.newRating || 0));
                    student.lastUpdated = new Date();
                    await student.save();
                    console.log(`Updated ratings for ${student.codeforcesHandle}: current=${student.currentRating}, max=${student.maxRating}`);
                }
            } catch (error) {
                console.error(`Failed to sync ratings for ${student.codeforcesHandle}:`, error.message);
            }
        }
        return { message: `Data synced for ${students.length} students` };
    } catch (error) {
        console.error('Data sync failed:', error);
        throw new Error('Failed to sync data');
    }
};

const startDataSync = () => {
    const job = new CronJob('0 0 * * *', async () => {
        console.log('Running scheduled data sync');
        await syncStudentData();
        console.log('Data sync completed');
    }, null, true, 'Asia/Kolkata');
    job.start();
    console.log('Data sync cron job started');
};

module.exports = { startDataSync, syncStudentData };