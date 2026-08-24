const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');


// @route   GET api/auth
// @desc    Get user data
// @access  Public 
router.get('/', auth, async (req, res) => {
    try {
        // included in the token
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public 
router.post('/',
    [
        // Validation
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Password is required')
            .exists()
    ],
    async (req, res) => {   // check for errors in body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }); // bad request error
        }

        const { email, password } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Match user and entered password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res
                    .status(400)
                    .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }

            // Return jsonwebtoken (JWT)
            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                config.get('jwtSecret'),                        // get the token from config file
                { expiresIn: 36000 },                           // set token expiration time
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });                        // send token to client upon success
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;