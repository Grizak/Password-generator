const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('./models/User');  // Assuming the User model is in the models folder
const app = express();
const PORT = process.env.PORT || 3000;
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const isAdmin = require('./public/middleware/admin'); // Assuming this is already created

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/passwords')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Define the route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get all users (admin only)
app.get('/admin/users', isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Route to update a user's role (admin only)
app.put('/admin/users/:id/role', isAdmin, async (req, res) => {
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

// Route to delete a user (admin only)
app.delete('/admin/users/:id', isAdmin, async (req, res) => {
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

// Use the admin routes under /admin paths
app.use('/admin', adminRoutes);

// Serve the admin dashboard (HTML file)
app.get('/admin/dashboard', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adminDashboard.html'));
});

// Step 3: User Registratison Route
app.post('/register', [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Email is invalid').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already in use' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Step 4: User Login Route
app.post('/login', async (req, res) => {
    try {
        // console.log('Login attempt received'); // Debugging

        const { email, password } = req.body;
        // console.log('Request body:', req.body); // Debugging

        if (!email || !password) {
            // console.log('Missing email or password'); // Debugging
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        // console.log('User found:', user); // Debugging

        if (!user) {
            // console.log('User not found'); // Debugging
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log('Password match:', isMatch); // Debugging

        if (!isMatch) {
            // console.log('Invalid password'); // Debugging
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // console.log('Token generated:', token); // Debugging

        res.json({ token });

    } catch (error) {
        // console.error('Error during login:', error); // Debugging
        res.status(500).json({ message: 'Server error' });
    }
});

// Optional: Protected Route Example
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Middleware to authenticate users
function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
