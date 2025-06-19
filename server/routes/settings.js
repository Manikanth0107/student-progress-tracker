const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/sync', settingsController.getSyncSettings);
router.put('/sync', settingsController.updateSyncSettings);
router.get('/cron', settingsController.getCronSettings);
router.put('/cron', settingsController.updateCronSettings);

module.exports = router;