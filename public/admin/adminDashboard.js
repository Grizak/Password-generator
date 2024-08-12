// Fetch users from the server
async function loadUsers() {
    try {
        const response = await fetch('/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
        });
        const users = await response.json();

        const userList = document.getElementById('user-list');
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `
                <p>${user.email} - ${user.role}</p>
                <button onclick="deleteUser('${user._id}')">Delete</button>
                <button onclick="changeRole('${user._id}', 'admin')">Make Admin</button>
                <button onclick="changeRole('${user._id}', 'user')">Make User</button>
            `;
            userList.appendChild(userDiv);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function deleteUser(userId) {
    try {
        await fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
        });
        location.reload();
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

async function changeRole(userId, role) {
    try {
        await fetch(`/admin/users/${userId}/role`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({ role })
        });
        location.reload();
    } catch (error) {
        console.error('Error changing role:', error);
    }
}

// Load users when the page loads
window.onload = loadUsers;
