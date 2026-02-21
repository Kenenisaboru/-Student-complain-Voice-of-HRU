const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Response message is required'],
        trim: true
    },
    isInternal: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const complaintSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a complaint title'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a complaint description'],
        trim: true,
        maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select a category']
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-review', 'in-progress', 'resolved', 'rejected', 'closed'],
        default: 'pending'
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String
    }],
    responses: [responseSchema],
    resolvedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        trim: true
    },
    satisfaction: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        feedback: String
    }
}, {
    timestamps: true
});

// Generate ticket ID before saving
complaintSchema.pre('save', async function (next) {
    if (!this.ticketId) {
        const count = await mongoose.model('Complaint').countDocuments();
        const year = new Date().getFullYear().toString().slice(-2);
        const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        this.ticketId = `VHU-${year}${month}-${(count + 1).toString().padStart(4, '0')}`;
    }

    // Set resolvedAt when status changes to resolved
    if (this.isModified('status') && this.status === 'resolved' && !this.resolvedAt) {
        this.resolvedAt = new Date();
    }

    next();
});

// Index for search and filtering
complaintSchema.index({ title: 'text', description: 'text' });
complaintSchema.index({ status: 1, priority: 1, category: 1 });
complaintSchema.index({ submittedBy: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
