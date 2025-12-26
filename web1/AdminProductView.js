// Load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

// Function to load products
function loadProducts() {
    eel.get_products()(function(products) {
        const productGrid = document.getElementById('productsGrid');
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <p>No products found</p>
                    <small>Add some products to get started</small>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            // Calculate discounted price
            const discountAmount = product.productPrice * (product.productDiscount / 100);
            const discountedPrice = product.productPrice - discountAmount;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.productImage}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    
                    <p class="product-info"><strong>Color:</strong> ${product.productColor}</p>
                    <p class="product-info"><strong>Size:</strong> ${product.productSize}</p>
                    <p class="product-info"><strong>Quantity:</strong> ${product.productQuantity}</p>
                    <p class="product-info"><strong>Return Policy:</strong> ${product.productReturnDays}</p>
                    <p class="product-info"><strong>Delivery:</strong> ${product.productDelveryPrice} RS</p>
                    <p class="product-info"><strong>Description:</strong> ${product.productDescription}</p>
                    
                    <div class="price-section">
                        <span class="original-price">${product.productPrice} RS</span>
                        <span class="discounted-price">${discountedPrice.toFixed(2)} RS</span>
                        <span class="discount-badge">${product.productDiscount}% OFF</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    });
}

// Function to search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value;
    const condition = document.getElementById('searchCondition').value;

    if (!searchTerm) {
        loadProducts();
        return;
    }

    eel.search_products(searchTerm, condition)(function(products) {
        const productGrid = document.getElementById('productsGrid');
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <p>No matching products found</p>
                    <small>Try a different search term</small>
                </div>
            `;
            return;
        }

        products.forEach(product => {
            // Calculate discounted price
            const discountAmount = product.productPrice * (product.productDiscount / 100);
            const discountedPrice = product.productPrice - discountAmount;

            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <img src="${product.productImage}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <h3 class="product-name">${product.name}</h3>
                    <span class="product-category">${product.category}</span>
                    
                    <p class="product-info"><strong>Color:</strong> ${product.productColor}</p>
                    <p class="product-info"><strong>Size:</strong> ${product.productSize}</p>
                    <p class="product-info"><strong>Quantity:</strong> ${product.productQuantity}</p>
                    <p class="product-info"><strong>Return Policy:</strong> ${product.productReturnDays}</p>
                    <p class="product-info"><strong>Delivery:</strong> ${product.productDelveryPrice} RS</p>
                    <p class="product-info"><strong>Description:</strong> ${product.productDescription}</p>
                    
                    <div class="price-section">
                        <span class="original-price">${product.productPrice} RS</span>
                        <span class="discounted-price">${discountedPrice.toFixed(2)} RS</span>
                        <span class="discount-badge">${product.productDiscount}% OFF</span>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    });
}
