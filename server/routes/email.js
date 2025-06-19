const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

router.post("/send-inactivity", emailController.sendInactivityEmail);
router.get("/settings", emailController.getEmailSettings);
router.put("/settings", emailController.updateEmailSettings);

router.get("/logs/:id", emailController.getEmailLogById);

router.get("/test", (req, res) => {
  res.send("Email route is working!");
});

module.exports = router;
