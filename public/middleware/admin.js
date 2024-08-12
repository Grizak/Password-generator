// middleware/admin.js

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next(); // Proceed if the user is an admin
    } else {
        res.status(403).send('Access denied.'); // Block access if not an admin
    }
}

module.exports = isAdmin;
