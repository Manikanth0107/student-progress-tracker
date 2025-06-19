const exportToCSV = (data, filename) => {
    const headers = ['Name,Email,Phone,Codeforces Handle,Current Rating,Max Rating,Last Updated'];
    const rows = data.map(student => [
        student.name,
        student.email,
        student.phone,
        student.codeforcesHandle,
        student.currentRating,
        student.maxRating,
        new Date(student.lastUpdated).toLocaleDateString(),
    ].join(','));

    const csvContent = [...headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export { exportToCSV };