const getFilteredContests = (contests, days) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return contests.filter(contest => new Date(contest.date) >= cutoffDate);
};

const getFilteredSubmissions = (submissions, days) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return submissions.filter(submission => new Date(submission.submissionTime) >= cutoffDate);
};

const groupByRatingBucket = (submissions) => {
    const buckets = {};
    submissions.forEach(submission => {
        const bucket = Math.floor(submission.rating / 100) * 100;
        buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    return Object.entries(buckets).map(([rating, count]) => ({ rating: Number(rating), count }));
};

export { getFilteredContests, getFilteredSubmissions, groupByRatingBucket };