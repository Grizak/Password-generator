// routes/adminRoutes.js

const express = require('express');
const User = require('../models/User');
const isAdmin = require('../public/middleware/admin');

const router = express.Router();

// Admin route to get all users
router.get('/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Admin route to update a user's role
router.put('/users/:id/role', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.role = req.body.role;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Admin route to delete a user
router.delete('/users/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
