const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        default: 'student'
    },
    studentId: {
        type: String,
        trim: true,
        sparse: true
    },
    department: {
        type: String,
        trim: true,
        enum: [
            'Computer Science',
            'Information Technology',
            'Information Systems',
            'Software Engineering',
            'Data Science',
            'Cybersecurity',
            'Other'
        ],
        default: 'Computer Science'
    },
    phone: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Get public profile (exclude sensitive fields)
userSchema.methods.toPublicJSON = function () {
    return {
        _id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
        studentId: this.studentId,
        department: this.department,
        phone: this.phone,
        avatar: this.avatar,
        isActive: this.isActive,
        lastLogin: this.lastLogin,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
