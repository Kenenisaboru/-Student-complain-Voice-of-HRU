const { validationResult, check } = require('express-validator');

exports.validateComplaint = [
    check('title', 'Title is required and must be at least 5 characters').isLength({ min: 5 }),
    check('description', 'Description is required').notEmpty(),
    check('category', 'Category is required valid MongoDB ID').isMongoId(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];
