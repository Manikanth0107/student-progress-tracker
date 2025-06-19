const emailService = require("../services/emailService");

exports.sendInactivityEmail = async (req, res) => {
  try {
    const { studentId } = req.body;
    const result = await emailService.sendInactivityEmailByStudentId(studentId);
    res.json({ message: "Inactivity email sent", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmailSettings = async (req, res) => {
  try {
    const settings = await emailService.getEmailSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch email settings" });
  }
};

exports.updateEmailSettings = async (req, res) => {
  try {
    const settings = await emailService.updateEmailSettings(req.body);
    res.json({ message: "Email settings updated", settings });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEmailLogById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await emailService.getEmailLogById(id);

    if (!log) {
      return res.status(404).json({ error: "Email log not found" });
    }

    res.json(log);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch email log" });
  }
};
