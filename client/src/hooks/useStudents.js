import { useState, useEffect } from 'react';
import axios from 'axios';

function useStudents() {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStudents = async () => {
        setIsLoading(true);
        setError('');
        try {
            console.log('Fetching students from /api/students');
            const res = await axios.get('/api/students');
            setStudents(res.data);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to fetch students';
            setError(errorMessage);
            console.error('Fetch students error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const addStudent = async ({ data }) => {
        try {
            const filteredData = {
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                codeforcesHandle: data.codeforcesHandle,
            };
            console.log('Posting this student data:', filteredData);
            const res = await axios.post('/api/students', filteredData);
            await fetchStudents();
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to add student';
            console.error('Add student error:', err);
            throw new Error(errorMessage);
        }
    };

    const updateStudent = async ({ id, data }) => {
        try {
            const filteredData = {
                name: data.name,
                email: data.email,
                phone: data.phone || '',
                codeforcesHandle: data.codeforcesHandle,
            };
            console.log('Updating student with ID:', id, 'Data:', filteredData);
            const res = await axios.put(`/api/students/${id}`, filteredData);
            await fetchStudents();
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to update student';
            console.error('Update student error:', err);
            throw new Error(errorMessage);
        }
    };

    const deleteStudent = async ({ id }) => {
        try {
            console.log('Deleting student with ID:', id);
            await axios.delete(`/api/students/${id}`);
            await fetchStudents();
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Failed to delete student';
            console.error('Delete student error:', err);
            throw new Error(errorMessage);
        }
    };

    return { students, isLoading, error, addStudent, updateStudent, deleteStudent, fetchStudents };
}

export default useStudents;