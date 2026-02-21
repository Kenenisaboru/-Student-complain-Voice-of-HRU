const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    getStaffMembers
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/staff', protect, authorize('admin'), getStaffMembers);

router.route('/')
    .get(protect, authorize('admin'), getUsers);

router.route('/:id')
    .get(protect, authorize('admin'), getUser)
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

module.exports = router;
