import { useState, useEffect } from "react";
import axios from "axios";
import useStudents from "../../hooks/useStudents";

function EmailSettings() {
  const { students, updateStudent } = useStudents();
  const [emailLogs, setEmailLogs] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const logs = {};
        for (const student of students) {
          const res = await axios.get(`/api/email/logs/${student._id}`);
          logs[student._id] = res.data.count || 0;
        }
        setEmailLogs(logs);
      } catch (err) {
        console.error("Failed to fetch email logs:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (students.length > 0) fetchLogs();
  }, [students]);

  const toggleEmailReminders = async (studentId, currentStatus) => {
    try {
      await updateStudent(studentId, { emailReminders: !currentStatus });
      alert("Email reminders updated");
    } catch (err) {
      console.error("Failed to update email reminders:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Reminder Emails</th>
              <th className="px-4 py-2">Emails Sent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td className="border px-4 py-2">{student.name}</td>
                <td className="border px-4 py-2">{student.email}</td>
                <td className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={student.emailReminders}
                    onChange={() =>
                      toggleEmailReminders(student._id, student.emailReminders)
                    }
                    className="form-checkbox"
                  />
                </td>
                <td className="border px-4 py-2">
                  {emailLogs[student._id] || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmailSettings;
