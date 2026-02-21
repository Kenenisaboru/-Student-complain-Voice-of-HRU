const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res, next) => {
    try {
        const { activeOnly } = req.query;
        const filter = activeOnly === 'true' ? { isActive: true } : {};

        const categories = await Category.find(filter).sort('name');

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
exports.getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private (admin)
exports.createCategory = async (req, res, next) => {
    try {
        const { name, description, icon, color } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a category name.'
            });
        }

        const category = await Category.create({
            name,
            description: description || '',
            icon: icon || '📋',
            color: color || '#6366f1'
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully!',
            category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (admin)
exports.updateCategory = async (req, res, next) => {
    try {
        const { name, description, icon, color, isActive } = req.body;

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description, icon, color, isActive },
            { new: true, runValidators: true }
        );

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category updated successfully!',
            category
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (admin)
exports.deleteCategory = async (req, res, next) => {
    try {
        const Complaint = require('../models/Complaint');

        // Check if category has complaints
        const complaintCount = await Complaint.countDocuments({ category: req.params.id });
        if (complaintCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. It has ${complaintCount} associated complaint(s). Deactivate it instead.`
            });
        }

        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
