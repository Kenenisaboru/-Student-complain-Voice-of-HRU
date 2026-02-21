const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (admin)
exports.getUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, role, search, department } = req.query;

        let filter = {};
        if (role) filter.role = role;
        if (department) filter.department = department;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort('-createdAt')
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            users: users.map(u => u.toPublicJSON()),
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / parseInt(limit)),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (admin)
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.status(200).json({
            success: true,
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
// @access  Private (admin)
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, role, department, isActive, phone, studentId } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (role) updateData.role = role;
        if (department) updateData.department = department;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (phone !== undefined) updateData.phone = phone;
        if (studentId !== undefined) updateData.studentId = studentId;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (admin)
exports.deleteUser = async (req, res, next) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account.'
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get staff members (for complaint assignment)
// @route   GET /api/users/staff
// @access  Private (admin)
exports.getStaffMembers = async (req, res, next) => {
    try {
        const staff = await User.find({
            role: { $in: ['staff', 'admin'] },
            isActive: true
        }).select('name email role department');

        res.status(200).json({
            success: true,
            staff
        });
    } catch (error) {
        next(error);
    }
};
