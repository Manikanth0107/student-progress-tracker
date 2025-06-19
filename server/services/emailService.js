const nodemailer = require("nodemailer");
const EmailLog = require("../models/EmailLog");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASS,
  },
});

const sendInactivityEmail = async (to, name) => {
  const subject = "Get Back to Problem Solving!";
  const html = `<p>Hi ${name},</p><p>It looks like you haven't submitted any solutions on Codeforces in over a week. Time to get back to problem solving!</p>`;

  try {
    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to,
      subject,
      html,
    });

    const log = new EmailLog({ to, subject, html });
    await log.save();

    console.log(`Inactivity email sent to ${to}`);
  } catch (error) {
    console.error("Email sending error:", error);
  }
};


const getEmailLogById = async (id) => {
  return await EmailLog.findById(id);
};

module.exports = {
  sendInactivityEmail,
  getEmailLogById,
};
