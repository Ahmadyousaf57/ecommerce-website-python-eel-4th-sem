// Load cart items when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

function loadCartItems() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        document.getElementById('cartItems').innerHTML = '<p>Your cart is empty</p>';
        return;
    }

    eel.get_cart_items(sessionId)(function(items) {
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (items.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            updateSummary(0, 0, 0);
            return;
        }

        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        let delivery = 0;

        items.forEach(item => {
            const discountAmount = item.price * (item.discount / 100);
            const discountedPrice = item.price - discountAmount;
            const itemTotal = discountedPrice * item.quantity;
            subtotal += itemTotal;
            delivery += item.delivery_price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">
                        ${discountedPrice.toFixed(2)} RS <span class="original-price">${item.price.toFixed(2)} RS</span>
                        <span class="discount-badge">${item.discount}% OFF</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <div class="cart-item-total">Total: ${itemTotal.toFixed(2)} RS</div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        updateSummary(subtotal, delivery, subtotal + delivery);
    });
}

function updateQuantity(productId, newQuantity) {
    const sessionId = localStorage.getItem('sessionId');
    eel.update_cart_quantity(sessionId, productId, newQuantity)(function(success) {
        if (success) {
            loadCartItems();
        }
    });
}

function removeFromCart(productId) {
    const sessionId = localStorage.getItem('sessionId');
    eel.remove_from_cart(sessionId, productId)(function(success) {
        if (success) {
            loadCartItems();
        }
    });
}

function updateSummary(subtotal, delivery, total) {
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' RS';
    document.getElementById('delivery').textContent = delivery.toFixed(2) + ' RS';
    document.getElementById('total').textContent = total.toFixed(2) + ' RS';
}

function proceedToCheckout() {
    window.location.href = 'BuyNow.html';
}

function continueShopping() {
    window.location.href = 'CustomerMain.html';
}
