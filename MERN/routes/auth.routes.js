const {Router} = require('express');
const {check, validationResult} = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = Router();

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Invalid email').isEmail(),
        check('password', 'Minimum password length 6 symbols').isLength({min: 6}),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect data during registration'
                })
            }

            const {email, password} = req.body;

            const candidate = await User.findOne({email: email});

            if(candidate) {
                return res.status(400).json({message: 'Such user already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email, password: hashedPassword})

            await user.save();

            res.status(201).json({message: 'User created'})

        } catch (e) {
            res.status(500).json({message: 'Something wrong. Try again...'})
        }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'Input password').exists(),
    ],
    async (req, res) => {
        try {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data during registration'
            })
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});
 
        if(!user) {
            return res.status(400).json({message: 'User is not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({message: 'Invalid password. Try again...'})
        }

        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret'),
            { expiresIn: '1h' }
        )

        res.json({token, userId: user.id})

        } catch (e) {
            res.status(500).json({message: 'Something wrong. Try again...'})
        }
})

module.exports = router;