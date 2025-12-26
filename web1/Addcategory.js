function addCategory() {
    const categoryName = document.getElementById('categoryName').value;
    eel.add_category(categoryName)(function(response) {
        alert(response);
        document.getElementById('categoryName').value = ''; // Clear the input field
    });
}