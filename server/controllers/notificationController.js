const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, unreadOnly } = req.query;

        let filter = { user: req.user._id };
        if (unreadOnly === 'true') filter.isRead = false;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [notifications, total, unreadCount] = await Promise.all([
            Notification.find(filter)
                .populate('relatedComplaint', 'ticketId title status')
                .sort('-createdAt')
                .skip(skip)
                .limit(parseInt(limit)),
            Notification.countDocuments(filter),
            Notification.countDocuments({ user: req.user._id, isRead: false })
        ]);

        res.status(200).json({
            success: true,
            notifications,
            unreadCount,
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

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read.'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted.'
        });
    } catch (error) {
        next(error);
    }
};
