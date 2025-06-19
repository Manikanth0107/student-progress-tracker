const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  codeforcesHandle: { type: String, unique: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  emailReminders: { type: Boolean, default: true },
  contests: [
    {
      contestId: Number,
      rank: Number,
      ratingChange: Number,
      date: Date,
      unsolvedCount: Number,
    },
  ],
  submissions: [
    {
      problemId: Number,
      problemName: String,
      rating: Number,
      submissionTime: Date,
      verdict: String,
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
