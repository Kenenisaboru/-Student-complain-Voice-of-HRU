const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '📋'
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    complaintCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
