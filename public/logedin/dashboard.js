// dashboard.js

document.getElementById('addPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const website = document.getElementById('website').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock implementation - replace with actual API call to save the password
    const passwordList = document.getElementById('password-list');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${website}</td>
        <td>${username}</td>
        <td>${password}</td>
        <td><button class="btn delete-btn">Delete</button></td>
    `;

    passwordList.appendChild(newRow);

    // Clear the form fields
    document.getElementById('website').value = '';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// Optionally add functionality to delete passwords
document.getElementById('password-list').addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        e.target.closest('tr').remove();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
        window.location.href = '/login.html';
    } else {
        // Fetch and display user data here
    }
});

document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
});
