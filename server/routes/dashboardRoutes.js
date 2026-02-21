const express = require('express');
const router = express.Router();
const { getStats, getAnalytics } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getStats);
router.get('/analytics', protect, authorize('admin'), getAnalytics);

module.exports = router;
