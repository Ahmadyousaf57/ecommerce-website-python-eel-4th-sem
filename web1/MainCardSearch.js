// Existing JavaScript functions (loadCategories, loadProducts, addProduct, deleteProduct, updateProduct, updateProductSubmit)
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;
    const condition = document.getElementById('searchCondition').value;

    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    eel.search_products(searchTerm, condition)(function (products) {
        const productList11 = document.getElementById('productsGrid');
        productList11.innerHTML = '';

        if (typeof products === 'string') {
            // If an error message is returned
            alert(products);
            return;
        }

        if (products.length === 0) {
            productList11.innerHTML = "<p>No products found.</p>";
            return;
        }

        // Display the filtered products
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
            <img src="${product.productImage}" alt="${product.name}" class="product-image">
            <h3>Title : ${product.name}</h3>
            <p> Discription : ${product.productDescription}</p>
             <p class="dress-card-para">Category: ${product.category}</p>
                        <p class="dress-card-para">Price: ${product.productPrice}</p>
                        <button onclick="Login('${product.name}')" class="update-btn">ADDTOCART</button>
        `;
            productList11.appendChild(card);
        });
    });
}
window.onload = function () {
    loadProducts();
};
function Login(name) {
    // Redirect to edit page or open modal with product data
    // You'll need to create an edit page or modal
    window.location.href = `Login.html?id=${name}`;
}