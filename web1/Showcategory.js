// Load categories when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Showcategory.js loaded");
    loadCategories();
});

// Function to load categories from backend
function loadCategories() {
    console.log("Loading categories...");
    eel.get_categories111()(function(categories) {
        console.log("Received categories:", categories);
        const tableBody = document.getElementById('categoryTableBody');
        
        if (!tableBody) {
            console.error("Could not find categoryTableBody element");
            return;
        }
        
        tableBody.innerHTML = '';
        
        if (!categories || categories.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="3" class="no-data">No categories found</td>`;
            tableBody.appendChild(row);
            return;
        }
        
        categories.forEach((category, index) => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${category}</td>
                <td class="action-buttons">
                    <button class="btn btn-edit" onclick="openEditModal('${category}')">Edit</button>
                    <button class="btn btn-delete" onclick="deleteCategory('${category}')">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
    });
}

// Function to add a new category
function addCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    eel.add_category(categoryName)(function(response) {
        if (response.includes("successfully")) {
            document.getElementById('newCategoryName').value = '';
            loadCategories();
            showAlert('Category added successfully!', 'success');
        } else {
            showAlert(response, 'error');
        }
    });
}

// Function to open edit modal
function openEditModal(categoryName) {
    document.getElementById('editCategoryName').value = categoryName;
    document.getElementById('editCategoryModal').style.display = 'block';
}

// Function to close edit modal
function closeEditModal() {
    document.getElementById('editCategoryModal').style.display = 'none';
}

// Function to update category
function updateCategory() {
    const oldName = document.getElementById('editCategoryName').value.trim();
    const newName = prompt('Enter new category name:', oldName);
    
    if (newName && newName !== oldName) {
        // In a real implementation, you would need to update the category in the database
        // Since your backend doesn't have an update_category function, we'll need to add one
        
        // First delete the old category
        eel.delete_category(oldName)(function(deleteResponse) {
            if (deleteResponse.includes("successfully")) {
                // Then add the new category
                eel.add_category(newName)(function(addResponse) {
                    if (addResponse.includes("successfully")) {
                        loadCategories();
                        closeEditModal();
                        showAlert('Category updated successfully!', 'success');
                    } else {
                        showAlert(addResponse, 'error');
                        // If adding new fails, add back the old category
                        eel.add_category(oldName);
                    }
                });
            } else {
                showAlert(deleteResponse, 'error');
            }
        });
    }
}

// Function to delete category
function deleteCategory(categoryName) {
    if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
        eel.delete_category(categoryName)(function(response) {
            if (response.includes("successfully")) {
                loadCategories();
                showAlert('Category deleted successfully!', 'success');
            } else {
                showAlert(response, 'error');
            }
        });
    }
}

// Function to show alert messages
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '10px 20px';
    alertDiv.style.borderRadius = '4px';
    alertDiv.style.color = 'white';
    alertDiv.style.zIndex = '1000';
    
    if (type === 'success') {
        alertDiv.style.backgroundColor = '#28a745';
    } else {
        alertDiv.style.backgroundColor = '#dc3545';
    }
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

