const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB (without deprecated options)
mongoose.connect('mongodb://localhost:27017/passwords');

// Define your schema and model as before
const passwordSchema = new mongoose.Schema({
    user: String,
    siteName: String,
    username: String,
    password: String,
});

const Password = mongoose.model('Password', passwordSchema);

app.use(express.static('public'));
app.use(express.json());

// Example route to save a password
app.post('/save-password', async (req, res) => {
    const { user, siteName, username, password } = req.body;
    const newPassword = new Password({ user, siteName, username, password });
    await newPassword.save();
    res.send('Password saved!');
});

// Example route to get passwords
app.get('/passwords/:user', async (req, res) => {
    const passwords = await Password.find({ user: req.params.user });
    res.json(passwords);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
