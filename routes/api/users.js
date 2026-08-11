const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

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

        const { name, email, password } = req.body;

        try {
            // See if user exists
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
            }

            // Get users gravatar
            const avatar = gravatar.url(email, {
                s: '200',  //size
                r: 'pg',   //rating
                d: 'mm'    //default
            });

            // Create instance of user
            user = new User({
                name,
                email,
                avatar,
                password
            });

            // Encrypt password
            const salt = await bcrypt.genSalt(10);                  // creates salt for hashing

            user.password = await bcrypt.hash(password, salt);      // hashing with salt

            await user.save();                                      // save user to database

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