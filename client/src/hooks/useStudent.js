import { useState, useEffect } from 'react';
import axios from 'axios';

function useStudent(id) {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchStudent = async () => {
            setIsLoading(true);
            setError('');
            try {
                const res = await axios.get(`/api/students/${id}`);
                setStudent(res.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch student');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudent();
    }, [id]);

    return { student, isLoading, error };
}

export default useStudent;