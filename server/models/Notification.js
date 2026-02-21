const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['complaint_submitted', 'complaint_assigned', 'complaint_updated', 'complaint_resolved', 'complaint_rejected', 'new_response', 'system'],
        default: 'system'
    },
    relatedComplaint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        default: null
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
