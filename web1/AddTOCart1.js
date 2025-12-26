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
                    <button onclick="window.location.href = 'Login1.html'" class="buy-btn">ADD TO CART</button>
                    <button onclick="window.location.href = 'Login1.html'" class="buy-btn">BUY NOW</button>
                </div>
            </div>
        `;
        // Display the modal
        modal.style.display = 'block';
    });
}



