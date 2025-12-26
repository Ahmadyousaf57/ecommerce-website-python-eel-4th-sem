// Function to show product details in the modal
function showProductDetails(productName) {
    eel.get_product_details1(productName)(function (product) {
        disc = product.productDiscount / 100;
        dis = product.productPrice * disc;
        discount = product.productPrice - dis;
        const modal = document.getElementById('productDetailsModal');
        const modalContent = document.getElementById('productDetailsContent');
        
        // Populate the modal with product details
        modalContent.innerHTML = `
            <div class="product-details">
                <div class="product-gallery">
                    <img src="${product.productImage}" id="main-image" alt="Product Image">
                </div>
                <div class="product-info">
                    <h1>${product.name}</h1>
                    <p class="description">${product.productDescription}</p>
                    <p class="price">Discount: <span class="original-price1">${product.productDiscount}%</span></p>
                    <p class="price">Price: <span class="original-price">${product.productPrice}RS</span><span class="discount-price">${discount}RS</span></p>
                    <div class="color-options">
                        <p>Color:</p>
                        <span class="color black" style="background-color:${product.productColor};"></span>
                    </div>
                    <div class="size-options">
                        <p>Size:</p>
                        <button>${product.productSize}</button>
                    </div>
                    <div class="size-options">
                        <p>Quantity:</p>
                        <button>${product.productQuantity}</button>
                    </div>
                    <div class="size-options">
                        <p>Delivery Price:</p>
                        <button>${product.productDelveryPrice}RS</button>
                    </div>
                    <div class="size-options">
                        <p>Return Days:</p>
                        <button>${product.productReturnDays}</button>
                    </div>
                    <button onclick="addToCart('${product.name}')" class="buy-btn">ADD TO CART</button>
                    <button onclick="BuYNoW('${product.name}')" class="buy-btn">BUY NOW</button>
                </div>
            </div>
        `;
        // Display the modal
        modal.style.display = 'block';
    });
}

// Function to get or create session ID
function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Modified addToCart function
function addToCart(productName) {
    const sessionId = getSessionId();
    eel.add_to_cart(sessionId, productName)(function(success) {
        if (success) {
            window.location.href = 'CartView.html';
            alert("Product added to cart successfully!");
            updateCartCount();
        } else {
            alert("Failed to add product to cart");
        }
    });
}

// Modified BuYNoW function - Directly redirects to CartView.html
function BuYNoW(productName) {
    const sessionId = getSessionId();
    eel.add_to_cart(sessionId, productName)(function(success) {
        if (success) {
            window.location.href = 'CartView.html';
            alert("Product added to cart successfully!");
            updateCartCount();
        } else {
            alert("Failed to add product to cart");
        }
    });
}

// Helper function to get current user ID (you need to implement this based on your auth system)
function getCurrentUserId() {
    // This is a placeholder - implement based on how you track logged in users
    // For example, you might store it in localStorage after login
    return localStorage.getItem('currentUserId') || 0;
}

// Close modal functions remain the same
document.querySelector('.close').addEventListener('click', function () {
    const modal = document.getElementById('productDetailsModal');
    modal.style.display = 'none';
});

window.addEventListener('click', function (event) {
    const modal = document.getElementById('productDetailsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
// Function to update cart count in header
function updateCartCount() {
    const sessionId = getSessionId();
    eel.get_cart_items(sessionId)(function(items) {
        const cartCount = document.getElementById('cartCount');
        if (cartCount) {
            cartCount.textContent = items.length;
            cartCount.style.display = items.length > 0 ? 'block' : 'none';
        }
    });
}