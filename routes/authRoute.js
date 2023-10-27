const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Video = require('../models/Video');
const authenticateToken = require('../middleware/auth');
const checkAdminRole = require('../middleware/adminToken');
const router = express.Router();



// Routes
router.get('/dashboard', authenticateToken, (req, res) => {
    res.render('dashboard');
});

// Rest of the routes (login, registration, etc.) can be added here
router.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/dashboard');
    } else {
        res.render('index');
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    req.session.user = user; // Save user in session
    res.header('auth-token', token).render('dashboard');
});

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
        return res.status(400).json({error:'User already exists'});
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username: username,
            password: hashedPassword
        });
        const savedUser = await user.save();
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/logout', (req, res) => {
    // Perform any necessary cleanup or logout logic here
    req.session.destroy();
    res.redirect('/');
});

router.get('/admin', authenticateToken, checkAdminRole, async (req, res) => {
    const all = await User.find();
    const allVid = await Video.find();
    res.render('admin', {members: all, videos: allVid});
});

router.delete('/deleteUser/:id', authenticateToken, checkAdminRole,  async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (deletedUser) {
            res.json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
