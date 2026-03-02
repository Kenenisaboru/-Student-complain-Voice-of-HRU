const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaint,
    updateStatus,
    assignComplaint,
    addResponse,
    rateComplaint,
    deleteComplaint
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateComplaint } = require('../middleware/validationMiddleware');

router.route('/')
    .post(protect, upload.array('attachments', 3), validateComplaint, createComplaint)
    .get(protect, getComplaints);

router.route('/:id')
    .get(protect, getComplaint)
    .delete(protect, deleteComplaint);

router.put('/:id/status', protect, authorize('admin', 'staff'), updateStatus);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);
router.post('/:id/respond', protect, addResponse);
router.put('/:id/rate', protect, authorize('student'), rateComplaint);

module.exports = router;
