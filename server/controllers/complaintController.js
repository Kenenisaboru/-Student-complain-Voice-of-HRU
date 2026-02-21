const Complaint = require('../models/Complaint');
const Category = require('../models/Category');
const Notification = require('../models/Notification');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private
exports.createComplaint = async (req, res, next) => {
    try {
        const { title, description, category, priority, isAnonymous } = req.body;

        // Validate required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: 'Please provide title, description, and category.'
            });
        }

        // Verify category exists
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc || !categoryDoc.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or inactive category.'
            });
        }

        // Handle file attachments
        let attachments = [];
        if (req.files && req.files.length > 0) {
            attachments = req.files.map(file => ({
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path
            }));
        }

        const complaint = await Complaint.create({
            title,
            description,
            category,
            priority: priority || 'medium',
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            submittedBy: req.user._id,
            attachments
        });

        // Update category complaint count
        await Category.findByIdAndUpdate(category, { $inc: { complaintCount: 1 } });

        // Create notification for admins
        const User = require('../models/User');
        const admins = await User.find({ role: { $in: ['admin', 'staff'] } });
        const notificationPromises = admins.map(admin =>
            Notification.create({
                user: admin._id,
                title: 'New Complaint Submitted',
                message: `A new complaint "${title}" has been submitted (${complaint.ticketId}).`,
                type: 'complaint_submitted',
                relatedComplaint: complaint._id
            })
        );
        await Promise.all(notificationPromises);

        // Populate and return
        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email department studentId');

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully!',
            complaint: populatedComplaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all complaints (with filtering, searching, pagination)
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            priority,
            category,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            assignedTo,
            submittedBy
        } = req.query;

        // Build filter
        let filter = {};

        // Role-based filtering
        if (req.user.role === 'student') {
            filter.submittedBy = req.user._id;
        } else if (req.user.role === 'staff') {
            // Staff can see complaints assigned to them or unassigned
            filter.$or = [
                { assignedTo: req.user._id },
                { assignedTo: null }
            ];
        }
        // Admin can see all

        // Apply filters
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = category;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (submittedBy && req.user.role !== 'student') filter.submittedBy = submittedBy;

        // Search
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { ticketId: { $regex: search, $options: 'i' } }
            ];
            // Override the role-based $or if searching
            if (req.user.role === 'student') {
                filter.submittedBy = req.user._id;
            }
        }

        // Sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [complaints, total] = await Promise.all([
            Complaint.find(filter)
                .populate('category', 'name icon color')
                .populate('submittedBy', 'name email department studentId')
                .populate('assignedTo', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Complaint.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            complaints,
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

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email department studentId avatar')
            .populate('assignedTo', 'name email avatar')
            .populate('responses.user', 'name email role avatar');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        // Check authorization
        if (
            req.user.role === 'student' &&
            complaint.submittedBy._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint.'
            });
        }

        res.status(200).json({
            success: true,
            complaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (admin/staff)
exports.updateStatus = async (req, res, next) => {
    try {
        const { status, rejectionReason } = req.body;

        const validStatuses = ['pending', 'in-review', 'in-progress', 'resolved', 'rejected', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value.'
            });
        }

        if (status === 'rejected' && !rejectionReason) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a reason for rejection.'
            });
        }

        const updateData = { status };
        if (status === 'rejected') updateData.rejectionReason = rejectionReason;
        if (status === 'resolved') updateData.resolvedAt = new Date();

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email department')
            .populate('assignedTo', 'name email');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        // Notify the complaint submitter
        const notifType = status === 'resolved' ? 'complaint_resolved' :
            status === 'rejected' ? 'complaint_rejected' : 'complaint_updated';

        await Notification.create({
            user: complaint.submittedBy._id,
            title: `Complaint ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `Your complaint "${complaint.title}" (${complaint.ticketId}) has been ${status}.`,
            type: notifType,
            relatedComplaint: complaint._id
        });

        res.status(200).json({
            success: true,
            message: `Complaint status updated to ${status}.`,
            complaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Assign complaint to staff
// @route   PUT /api/complaints/:id/assign
// @access  Private (admin)
exports.assignComplaint = async (req, res, next) => {
    try {
        const { assignedTo } = req.body;

        if (!assignedTo) {
            return res.status(400).json({
                success: false,
                message: 'Please specify a staff member to assign.'
            });
        }

        const User = require('../models/User');
        const staffMember = await User.findById(assignedTo);
        if (!staffMember || (staffMember.role !== 'staff' && staffMember.role !== 'admin')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid staff member.'
            });
        }

        const complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            {
                assignedTo,
                status: 'in-review'
            },
            { new: true }
        )
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email department')
            .populate('assignedTo', 'name email');

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        // Notify assigned staff
        await Notification.create({
            user: assignedTo,
            title: 'Complaint Assigned to You',
            message: `Complaint "${complaint.title}" (${complaint.ticketId}) has been assigned to you.`,
            type: 'complaint_assigned',
            relatedComplaint: complaint._id
        });

        // Notify submitter
        await Notification.create({
            user: complaint.submittedBy._id,
            title: 'Complaint Assigned',
            message: `Your complaint "${complaint.title}" has been assigned to ${staffMember.name} for review.`,
            type: 'complaint_updated',
            relatedComplaint: complaint._id
        });

        res.status(200).json({
            success: true,
            message: `Complaint assigned to ${staffMember.name}.`,
            complaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Add response to complaint
// @route   POST /api/complaints/:id/respond
// @access  Private
exports.addResponse = async (req, res, next) => {
    try {
        const { message, isInternal } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a response message.'
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        // Check authorization for students
        if (
            req.user.role === 'student' &&
            complaint.submittedBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to respond to this complaint.'
            });
        }

        complaint.responses.push({
            user: req.user._id,
            message,
            isInternal: req.user.role !== 'student' ? (isInternal || false) : false
        });

        await complaint.save();

        // Populate the updated complaint
        const updatedComplaint = await Complaint.findById(complaint._id)
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email department')
            .populate('assignedTo', 'name email')
            .populate('responses.user', 'name email role avatar');

        // Send notification
        if (req.user.role !== 'student' && !isInternal) {
            await Notification.create({
                user: complaint.submittedBy,
                title: 'New Response on Your Complaint',
                message: `A new response has been added to your complaint "${complaint.title}" (${complaint.ticketId}).`,
                type: 'new_response',
                relatedComplaint: complaint._id
            });
        } else if (req.user.role === 'student' && complaint.assignedTo) {
            await Notification.create({
                user: complaint.assignedTo,
                title: 'Student Replied',
                message: `Student replied to complaint "${complaint.title}" (${complaint.ticketId}).`,
                type: 'new_response',
                relatedComplaint: complaint._id
            });
        }

        res.status(200).json({
            success: true,
            message: 'Response added successfully.',
            complaint: updatedComplaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Rate complaint resolution (satisfaction)
// @route   PUT /api/complaints/:id/rate
// @access  Private (student)
exports.rateComplaint = async (req, res, next) => {
    try {
        const { rating, feedback } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a rating between 1 and 5.'
            });
        }

        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        if (complaint.submittedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Only the complaint submitter can rate.'
            });
        }

        if (complaint.status !== 'resolved') {
            return res.status(400).json({
                success: false,
                message: 'You can only rate resolved complaints.'
            });
        }

        complaint.satisfaction = { rating, feedback: feedback || '' };
        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Thank you for your feedback!',
            complaint
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (admin or owner if pending)
exports.deleteComplaint = async (req, res, next) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found.'
            });
        }

        // Only admin can delete any, students can only delete their own pending complaints
        if (req.user.role === 'student') {
            if (complaint.submittedBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to delete this complaint.'
                });
            }
            if (complaint.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'You can only delete pending complaints.'
                });
            }
        }

        await Complaint.findByIdAndDelete(req.params.id);

        // Decrement category count
        await Category.findByIdAndUpdate(complaint.category, { $inc: { complaintCount: -1 } });

        res.status(200).json({
            success: true,
            message: 'Complaint deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
