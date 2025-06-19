const mongoose = require('mongoose');
const Student = require('../models/Student');
const { fetchUserInfo, fetchUserContests } = require('./codeforcesAPI');

const validateCodeforcesHandle = async (handle) => {
    if (!handle || typeof handle !== 'string') {
        return false;
    }
    try {
        const userInfo = await fetchUserInfo(handle.trim());
        return !!userInfo;
    } catch (error) {
        console.error('Codeforces API error:', error.message);
        return false;
    }
};

const fetchAndUpdateRatings = async (student) => {
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
        return student;
    } catch (error) {
        console.error(`Error updating ratings for ${student.codeforcesHandle}:`, error);
        return student;
    }
};

const createStudent = async ({ name, email, phone, codeforcesHandle }) => {
    if (!name || !email || !codeforcesHandle) {
        throw new Error('Name, email, and Codeforces handle are required');
    }

    if (!await validateCodeforcesHandle(codeforcesHandle)) {
        throw new Error('Invalid Codeforces handle');
    }

    const existingStudent = await Student.findOne({
        $or: [{ email }, { codeforcesHandle }],
    });
    if (existingStudent) {
        throw new Error('Email or Codeforces handle already exists');
    }

    const student = new Student({
        name,
        email,
        phone: phone || '',
        codeforcesHandle,
        currentRating: 0,
        maxRating: 0,
        emailReminders: true,
    });

    await student.save();
    return await fetchAndUpdateRatings(student);
};

const getStudentById = async (id) => {
    if (!id || !mongoose.isValidObjectId(id)) {
        throw new Error('Invalid student ID');
    }
    const student = await Student.findById(id);
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};

const getAllStudents = async () => {
    return await Student.find();
};

const updateStudent = async (id, updates) => {
    if (!id || !mongoose.isValidObjectId(id)) {
        throw new Error('Invalid student ID');
    }

    const allowedUpdates = ['name', 'email', 'phone', 'emailReminders', 'codeforcesHandle'];
    const updateKeys = Object.keys(updates);
    const isValidUpdate = updateKeys.every(key => allowedUpdates.includes(key));

    if (!isValidUpdate) {
        throw new Error('Invalid update fields');
    }

    if (updates.email) {
        const existingStudent = await Student.findOne({ email: updates.email, _id: { $ne: id } });
        if (existingStudent) {
            throw new Error('Email already exists');
        }
    }

    if (updates.codeforcesHandle) {
        if (!await validateCodeforcesHandle(updates.codeforcesHandle)) {
            throw new Error('Invalid Codeforces handle');
        }
        const existingStudent = await Student.findOne({ codeforcesHandle: updates.codeforcesHandle, _id: { $ne: id } });
        if (existingStudent) {
            throw new Error('Codeforces handle already exists');
        }
    }

    const student = await Student.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });
    if (!student) {
        throw new Error('Student not found');
    }

    if (updates.codeforcesHandle) {
        return await fetchAndUpdateRatings(student);
    }
    return student;
};

const deleteStudent = async (id) => {
    if (!id || !mongoose.isValidObjectId(id)) {
        throw new Error('Invalid student ID');
    }
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
        throw new Error('Student not found');
    }
    return student;
};

module.exports = {
    createStudent,
    getStudentById,
    getAllStudents,
    updateStudent,
    deleteStudent,
    validateCodeforcesHandle,
};