function loadProducts() {
  eel.get_products()(function(products) {
      const productList = document.getElementById('productsGrid');
      const adminProductList = document.getElementById('productsGrid11');
      
      // Clear existing content
      productList.innerHTML = '';
      adminProductList.innerHTML = '';
      
      // Empty state
      if (products.length === 0) {
          const emptyRow = `
              <tr>
                  <td colspan="12">
                      <div class="empty-state">
                          <i class="fas fa-box-open"></i>
                          <p>No products found</p>
                          <small>Add some products to get started</small>
                      </div>
                  </td>
              </tr>
          `;
          productList.innerHTML = emptyRow;
          adminProductList.innerHTML = emptyRow;
          return;
      }

      // Populate tables
      products.forEach(product => {
          const disc = product.productDiscount / 100;
          const dis = product.productPrice * disc;
          const discount = product.productPrice - dis;
          
          const row = document.createElement('tr');
          row.className = 'product-row';
          row.innerHTML = `
              <td data-label="Name">${product.name}</td>
              <td data-label="Description">${product.productDescription}</td>
              <td data-label="Category"><span class="status status-active">${product.category}</span></td>
              <td data-label="Quantity">${product.productQuantity}</td>
              <td data-label="Color">${product.productColor}</td>
              <td data-label="Size">${product.productSize}</td>
              <td data-label="Discount">${product.productDiscount}%</td>
              <td data-label="Price">
                  <span class="price-original">${product.productPrice} RS</span>
              </td>
              <td data-label="Discounted">
                  <span class="price-discounted">${discount.toFixed(2)} RS</span>
              </td>
              <td data-label="Delivery">${product.productDelveryPrice} RS</td>
              <td data-label="Returns">${product.productReturnDays} days</td>
              <td data-label="Actions">
                  <div class="action-buttons">
                      <button class="action-btn edit" onclick="editProduct('${product.name}')" title="Edit">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button class="action-btn delete" onclick="deleteProduct('${product.name}')" title="Delete">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
              </td>
          `;
          productList.appendChild(row.cloneNode(true));
          adminProductList.appendChild(row);
      });
  });
}

function deleteProduct(productName) {
  if (confirm(`Are you sure you want to delete "${productName}"?`)) {
      eel.delete_product(productName)(function(response) {
          alert(response);
          loadProducts(); // Reload the product list
      });
  }
}

function editProduct(productName) {
  window.location.href = `Updateproduct.html?id=${encodeURIComponent(productName)}`;
}

// Load products when the page loads
document.addEventListener('DOMContentLoaded', function() {
  loadProducts();
});