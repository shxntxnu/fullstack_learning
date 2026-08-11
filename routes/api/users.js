const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// @route   POST api/users
// @desc    register user
// @access  Public (don't need token if public)
router.post('/',
    [
        // Validation
        check('name', 'Name is required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
            .isLength({ min: 6 })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // bad request error
        }

        // Create a user in the database
        const { } = req.body;

        res.send('User register route');
    });

module.exports = router;