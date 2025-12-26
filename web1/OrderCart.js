
// Tab switching functionality
function switchTab(tabName) {
    // Update tab styling
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Update content visibility
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// Load orders from database
function loadOrders() {
    eel.get_all_orders()(function(orders) {
        const orderList = document.getElementById('ordersGrid');
        orderList.innerHTML = '';
        
        if (!orders || orders.length === 0) {
            orderList.innerHTML = `
                <tr>
                    <td colspan="12" style="text-align: center; padding: 30px;">
                        No orders found.
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'order-row';
            
            // Format address
            const addressParts = [];
            if (order.Address1) addressParts.push(order.Address1);
            if (order.City) addressParts.push(order.City);
            if (order.Province) addressParts.push(order.Province);
            if (order.Country) addressParts.push(order.Country);
            const formattedAddress = addressParts.join(', ');
            
            // Format date
            const orderDate = new Date(order.OrderDate);
            const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
            
            // Status badge
            let statusClass = 'status-pending';
            if (order.Status1.toLowerCase() === 'completed') statusClass = 'status-completed';
            if (order.Status1.toLowerCase() === 'cancelled') statusClass = 'status-cancelled';
            
            row.innerHTML = `
                <td data-label="Order ID">${order.OrderID}</td>
                <td data-label="Customer">${order.CustomerName || 'N/A'}</td>
                <td data-label="Email">${order.CustomerEmail || 'N/A'}</td>
                <td data-label="Phone">${order.CustomerPhone || 'N/A'}</td>
                <td data-label="Address">${formattedAddress || 'N/A'}</td>
                <td data-label="Payment">${order.PaymentMethod || 'N/A'}</td>
                <td data-label="Subtotal">${order.Subtotal || '0.00'}</td>
                <td data-label="Delivery">${order.Delivery || '0.00'}</td>
                <td data-label="Total">${order.Total || '0.00'}</td>
                <td data-label="Status"><span class="status ${statusClass}">${order.Status1 || 'Pending'}</span></td>
                <td data-label="Date">${formattedDate}</td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewOrderDetails(${order.OrderID})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteOrder(${order.OrderID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            orderList.appendChild(row);
        });
    });
}

// Load carts from database
function loadCarts() {
    eel.get_all_carts()(function(carts) {
        const cartList = document.getElementById('cartsGrid');
        cartList.innerHTML = '';
        
        if (!carts || carts.length === 0) {
            cartList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px;">
                        No active carts found.
                    </td>
                </tr>
            `;
            return;
        }

        carts.forEach(cart => {
            const row = document.createElement('tr');
            row.className = 'cart-row';
            row.innerHTML = `
                <td data-label="Cart ID">${cart.CartID}</td>
                <td data-label="Session ID">${cart.SessionID || 'N/A'}</td>
                <td data-label="Product ID">${cart.ProductID || 'N/A'}</td>
                <td data-label="Quantity">${cart.Quantity || '1'}</td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        <button class="action-btn delete" onclick="deleteCart(${cart.CartID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            cartList.appendChild(row);
        });
    });
}

// Search orders
function searchOrders() {
    const searchTerm = document.getElementById('orderSearchInput').value;
    const condition = document.getElementById('orderSearchCondition').value;
    
    eel.search_orders(searchTerm, condition)(function(orders) {
        const orderList = document.getElementById('ordersGrid');
        orderList.innerHTML = '';
        
        if (!orders || orders.length === 0) {
            orderList.innerHTML = `
                <tr>
                    <td colspan="12" style="text-align: center; padding: 30px;">
                        No orders found matching your criteria.
                    </td>
                </tr>
            `;
            return;
        }

        orders.forEach(order => {
            const row = document.createElement('tr');
            row.className = 'order-row';
            
            // Format address
            const addressParts = [];
            if (order.Address1) addressParts.push(order.Address1);
            if (order.City) addressParts.push(order.City);
            if (order.Province) addressParts.push(order.Province);
            if (order.Country) addressParts.push(order.Country);
            const formattedAddress = addressParts.join(', ');
            
            // Format date
            const orderDate = new Date(order.OrderDate);
            const formattedDate = orderDate.toLocaleDateString() + ' ' + orderDate.toLocaleTimeString();
            
            // Status badge
            let statusClass = 'status-pending';
            if (order.Status1.toLowerCase() === 'completed') statusClass = 'status-completed';
            if (order.Status1.toLowerCase() === 'cancelled') statusClass = 'status-cancelled';
            
            row.innerHTML = `
                <td data-label="Order ID">${order.OrderID}</td>
                <td data-label="Customer">${order.CustomerName || 'N/A'}</td>
                <td data-label="Email">${order.CustomerEmail || 'N/A'}</td>
                <td data-label="Phone">${order.CustomerPhone || 'N/A'}</td>
                <td data-label="Address">${formattedAddress || 'N/A'}</td>
                <td data-label="Payment">${order.PaymentMethod || 'N/A'}</td>
                <td data-label="Subtotal">${order.Subtotal?.toFixed(2) || '0.00'}</td>
                <td data-label="Delivery">${order.Delivery?.toFixed(2) || '0.00'}</td>
                <td data-label="Total">${order.Total?.toFixed(2) || '0.00'}</td>
                <td data-label="Status"><span class="status ${statusClass}">${order.Status1 || 'Pending'}</span></td>
                <td data-label="Date">${formattedDate}</td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewOrderDetails(${order.OrderID})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteOrder(${order.OrderID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            orderList.appendChild(row);
        });
    });
}

// Search carts
function searchCarts() {
    const searchTerm = document.getElementById('cartSearchInput').value;
    const condition = document.getElementById('cartSearchCondition').value;
    
    eel.search_carts(searchTerm, condition)(function(carts) {
        const cartList = document.getElementById('cartsGrid');
        cartList.innerHTML = '';
        
        if (!carts || carts.length === 0) {
            cartList.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 30px;">
                        No carts found matching your criteria.
                    </td>
                </tr>
            `;
            return;
        }

        carts.forEach(cart => {
            const row = document.createElement('tr');
            row.className = 'cart-row';
            row.innerHTML = `
                <td data-label="Cart ID">${cart.CartID}</td>
                <td data-label="Session ID">${cart.SessionID || 'N/A'}</td>
                <td data-label="Product ID">${cart.ProductID || 'N/A'}</td>
                <td data-label="Quantity">${cart.Quantity || '1'}</td>
                <td data-label="Actions">
                    <div class="action-buttons">
                        <button class="action-btn delete" onclick="deleteCart(${cart.CartID})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            cartList.appendChild(row);
        });
    });
}

// Delete order
function deleteOrder(orderId) {
    if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
        eel.delete_order(orderId)(function(response) {
            alert(response);
            loadOrders(); // Reload the order list
        });
    }
}

// Delete cart
function deleteCart(cartId) {
    if (confirm("Are you sure you want to delete this cart item?")) {
        eel.delete_cart(cartId)(function(response) {
            alert(response);
            loadCarts(); // Reload the cart list
        });
    }
}

// View order details (placeholder - you can implement this)
function viewOrderDetails(orderId) {
    alert(`Viewing details for order #${orderId}`);
    // You can implement a modal or redirect to a details page
}

// Load data when page loads
window.onload = function() {
    loadOrders();
    loadCarts();
};
