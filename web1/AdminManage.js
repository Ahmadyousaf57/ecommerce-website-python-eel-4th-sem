window.onload = function () {
    loadUsers();
};

// Function to load all users from database
function loadUsers() {
    eel.get_all_users()(function (users) {
        const adminGrid = document.getElementById('adminUsersGrid');
        const customerGrid = document.getElementById('customerUsersGrid');

        adminGrid.innerHTML = '';
        customerGrid.innerHTML = '';

        if (users.length === 0) {
            adminGrid.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
            customerGrid.innerHTML = '<tr><td colspan="8" style="text-align: center;">No users found</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'user-row';
            row.innerHTML = `
                <td data-label="ID">${user.SUserID}</td>
                <td data-label="Name">${user.SIGN_UP_Name}</td>
                <td data-label="Email">${user.SIGN_UP_Email}</td>
                <td data-label="DOB">${user.SIGN_UP_DOB}</td>
                <td data-label="Gender">${user.SIGN_UP_Gender}</td>
                <td data-label="Age">${user.SIGN_UP_AGE}</td>
                <td data-label="Role"><span class="status ${user.SIGN_UP_administration === 'Admin' ? 'status-active' : 'status-inactive'}">${user.SIGN_UP_administration}</span></td>
                <td data-label="Actions">
                    <button class="action-btn edit" onclick="editUser('${user.SUserID}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser('${user.SUserID}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            if (user.SIGN_UP_administration === 'Admin') {
                adminGrid.appendChild(row);
            } else {
                customerGrid.appendChild(row);
            }
        });
    });
}

// Function to search users
function searchUsers() {
    const searchTerm = document.getElementById('userSearchInput').value;
    const condition = document.getElementById('userSearchCondition').value;

    if (!searchTerm) {
        loadUsers();
        return;
    }

    eel.search_users(searchTerm, condition)(function (users) {
        const adminGrid = document.getElementById('adminUsersGrid');
        const customerGrid = document.getElementById('customerUsersGrid');

        adminGrid.innerHTML = '';
        customerGrid.innerHTML = '';

        if (users.length === 0) {
            adminGrid.innerHTML = '<tr><td colspan="8" style="text-align: center;">No matching users found</td></tr>';
            customerGrid.innerHTML = '<tr><td colspan="8" style="text-align: center;">No matching users found</td></tr>';
            return;
        }

        users.forEach(user => {
            const row = document.createElement('tr');
            row.className = 'user-row';
            row.innerHTML = `
    <td data-label="ID">${user.SUserID}</td>
    <td data-label="Name">${user.SIGN_UP_Name}</td>
    <td data-label="Email">${user.SIGN_UP_Email}</td>
    <td data-label="DOB">${user.SIGN_UP_DOB}</td>
    <td data-label="Gender">${user.SIGN_UP_Gender}</td>
    <td data-label="Age">${user.SIGN_UP_AGE}</td>
    <td data-label="Role"><span class="status ${user.SIGN_UP_administration === 'Admin' ? 'status-active' : 'status-inactive'}">${user.SIGN_UP_administration}</span></td>
    <td data-label="Actions">
        <button class="action-btn edit" onclick="editUser('${user.SUserID}')">
            <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete" onclick="deleteUser('${user.SUserID}')">
            <i class="fas fa-trash"></i>
        </button>
    </td>
`;

            if (user.SIGN_UP_administration === 'Admin') {
                adminGrid.appendChild(row);
            } else {
                customerGrid.appendChild(row);
            }
        });
    });
}

// Function to open edit modal with user data
function editUser(userId) {
    eel.get_user_details(userId)(function(user) {
        if (user) {
            // Format the date for the date input (YYYY-MM-DD)
            const dob = new Date(user.SIGN_UP_DOB);
            const formattedDOB = dob.toISOString().split('T')[0];
            
            // Fill the form with user data
            document.getElementById('editUserId').value = user.SUserID;
            document.getElementById('editName').value = user.SIGN_UP_Name;
            document.getElementById('editEmail').value = user.SIGN_UP_Email;
            document.getElementById('editDOB').value = formattedDOB;
            document.getElementById('editGender').value = user.SIGN_UP_Gender.toLowerCase();
            document.getElementById('editAge').value = user.SIGN_UP_AGE;
            document.getElementById('editRole').value = user.SIGN_UP_administration;
            
            // Show modal
            document.getElementById('editUserModal').style.display = 'block';
        } else {
            alert('User not found');
        }
    });
}

// Function to close edit modal
function closeEditModal() {
    document.getElementById('editUserModal').style.display = 'none';
}

// Function to submit user edits
function submitUserEdit() {
    const userId = document.getElementById('editUserId').value;
    const userData = {
        name: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        password: document.getElementById('editPassword').value,
        dob: document.getElementById('editDOB').value,
        gender: document.getElementById('editGender').value,
        age: document.getElementById('editAge').value,
        role: document.getElementById('editRole').value
    };

    eel.update_user(userId, userData)(function (response) {
        alert(response);
        closeEditModal();
        loadUsers(); // Refresh the user list
    });
}

// Function to delete user
function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        eel.delete_user(userId)(function (response) {
            alert(response);
            loadUsers(); // Refresh the user list
        });
    }
}