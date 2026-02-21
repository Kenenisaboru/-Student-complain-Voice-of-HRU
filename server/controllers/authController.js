const User = require('../models/User');
const validator = require('validator');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, studentId, department, phone } = req.body;

        // Validate inputs
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password.'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.'
            });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists.'
            });
        }

        // Create user (default role is 'student')
        const user = await User.create({
            name,
            email,
            password,
            studentId: studentId || '',
            department: department || 'Computer Science',
            phone: phone || ''
        });

        // Generate token
        const token = user.generateToken();

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password.'
            });
        }

        // Find user with password field included
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Your account has been deactivated. Contact admin.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate token
        const token = user.generateToken();

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.status(200).json({
            success: true,
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, department, studentId } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;
        if (department) updateData.department = department;
        if (studentId !== undefined) updateData.studentId = studentId;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            user: user.toPublicJSON()
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password.'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters.'
            });
        }

        const user = await User.findById(req.user._id).select('+password');
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect.'
            });
        }

        user.password = newPassword;
        await user.save();

        const token = user.generateToken();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.',
            token
        });
    } catch (error) {
        next(error);
    }
};
