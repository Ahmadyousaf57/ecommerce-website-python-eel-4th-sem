// search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;
    const condition = document.getElementById('searchCondition').value;
    if (!searchTerm) {
        alert("Please enter a search term.");
        return;
    }

    // Special handling for price search
    if (condition === "Price") {
        // Convert search term to number for price comparison
        const priceValue = parseFloat(searchTerm);
        if (isNaN(priceValue)) {
            alert("Please enter a valid number for price search.");
            return;
        }
        eel.search_products_by_price(priceValue)(displaySearchResults);
    } else {
        // Normal text search for other conditions
        eel.search_products(searchTerm, condition)(displaySearchResults);
    }
}
function displaySearchResults(products) {
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
        disc = product.productDiscount / 100;
        dis = product.productPrice * disc;
        discount = product.productPrice - dis;
        
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.productImage}" alt="${product.name}" class="product-image">
            <h3>Title : ${product.name}</h3>
            <p> Discription : ${product.productDescription}</p>
            <p class="dress-card-para">Category: ${product.category}</p>
            <p class="dress-card-para">Color: ${product.productColor}</p>
            <p class="dress-card-para">Quantity: ${product.productQuantity}</p>
            <p class="dress-card-para">Size: ${product.productSize}</p>
            <p class="dress-card-para">Price: ${product.productPrice}RS</p>
            <p class="dress-card-para">Discount Price: ${discount}RS</p>
            <button onclick="showProductDetails('${product.name}')" class="update-btn">ADDTOCART</button>
        `;
        productList11.appendChild(card);
    });
}
window.onload = function () {
    loadProducts();
};