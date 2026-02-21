const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Category = require('../models/Category');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        let filter = {};

        // Role-based filtering
        if (req.user.role === 'student') {
            filter.submittedBy = req.user._id;
        } else if (req.user.role === 'staff') {
            filter.$or = [
                { assignedTo: req.user._id },
                { assignedTo: null }
            ];
        }

        // Get complaint counts by status
        const statusCounts = await Complaint.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Get complaint counts by priority
        const priorityCounts = await Complaint.aggregate([
            { $match: filter },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // Total complaints
        const totalComplaints = await Complaint.countDocuments(filter);

        // Recent complaints
        const recentComplaints = await Complaint.find(filter)
            .populate('category', 'name icon color')
            .populate('submittedBy', 'name email')
            .populate('assignedTo', 'name email')
            .sort('-createdAt')
            .limit(5);

        // Format status counts
        const statusMap = {};
        statusCounts.forEach(s => { statusMap[s._id] = s.count; });

        const priorityMap = {};
        priorityCounts.forEach(p => { priorityMap[p._id] = p.count; });

        // Additional admin stats
        let additionalStats = {};
        if (req.user.role === 'admin') {
            const [totalUsers, totalStudents, totalStaff, totalCategories] = await Promise.all([
                User.countDocuments(),
                User.countDocuments({ role: 'student' }),
                User.countDocuments({ role: 'staff' }),
                Category.countDocuments({ isActive: true })
            ]);

            // Average resolution time (in days)
            const resolvedComplaints = await Complaint.find({
                status: 'resolved',
                resolvedAt: { $ne: null }
            });

            let avgResolutionTime = 0;
            if (resolvedComplaints.length > 0) {
                const totalTime = resolvedComplaints.reduce((acc, c) => {
                    return acc + (c.resolvedAt - c.createdAt);
                }, 0);
                avgResolutionTime = Math.round(totalTime / resolvedComplaints.length / (1000 * 60 * 60 * 24) * 10) / 10;
            }

            // Satisfaction average
            const ratedComplaints = await Complaint.find({ 'satisfaction.rating': { $exists: true, $ne: null } });
            let avgSatisfaction = 0;
            if (ratedComplaints.length > 0) {
                avgSatisfaction = Math.round(
                    ratedComplaints.reduce((acc, c) => acc + c.satisfaction.rating, 0) / ratedComplaints.length * 10
                ) / 10;
            }

            additionalStats = {
                totalUsers,
                totalStudents,
                totalStaff,
                totalCategories,
                avgResolutionTime,
                avgSatisfaction,
                ratedCount: ratedComplaints.length
            };
        }

        res.status(200).json({
            success: true,
            stats: {
                totalComplaints,
                statusCounts: statusMap,
                priorityCounts: priorityMap,
                recentComplaints,
                ...additionalStats
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get analytics data
// @route   GET /api/dashboard/analytics
// @access  Private (admin)
exports.getAnalytics = async (req, res, next) => {
    try {
        const { period = '30' } = req.query;
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        // Complaints over time (grouped by day)
        const complaintsOverTime = await Complaint.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Complaints by category
        const complaintsByCategory = await Complaint.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            { $unwind: '$categoryInfo' },
            {
                $group: {
                    _id: '$categoryInfo.name',
                    count: { $sum: 1 },
                    color: { $first: '$categoryInfo.color' }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Complaints by department
        const complaintsByDepartment = await Complaint.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'submittedBy',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' },
            {
                $group: {
                    _id: '$userInfo.department',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Resolution rate
        const totalResolved = await Complaint.countDocuments({ status: 'resolved' });
        const totalAll = await Complaint.countDocuments();
        const resolutionRate = totalAll > 0 ? Math.round((totalResolved / totalAll) * 100) : 0;

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Complaint.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
                    }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.status(200).json({
            success: true,
            analytics: {
                complaintsOverTime,
                complaintsByCategory,
                complaintsByDepartment,
                resolutionRate,
                monthlyTrend
            }
        });
    } catch (error) {
        next(error);
    }
};
