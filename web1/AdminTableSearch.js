// Add this function to display search results for both regular and price searches
function displaySearchResults(products) {
  const productList11 = document.getElementById('productsGrid11');
  productList11.innerHTML = '';

  if (typeof products === 'string') {
      // If an error message is returned
      alert(products);
      return;
  }

  if (products.length === 0) {
      productList11.innerHTML = "<tr><td colspan='12'>No products found.</td></tr>";
      return;
  }

  products.forEach(product => {
      disc = product.productDiscount/100;
      dis = product.productPrice*disc;
      discount = product.productPrice-dis;
      
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
          <td data-label="Price">${product.productPrice}RS</td>
          <td data-label="Discount Price">${discount}RS</td>
          <td data-label="Delivery Price">${product.productDelveryPrice}RS</td>
          <td data-label="Return Days">${product.productReturnDays}</td>
          <td data-label="Actions">
              <button class="action-btn edit" onclick="editProduct('${product.name}')">
                  <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete" onclick="deleteProduct('${product.name}')">
                  <i class="fas fa-trash"></i>
              </button>
          </td>
      `;
      productList11.appendChild(row);
  });
}

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

// ... rest of your existing code ...
function deleteProduct(productName) {
  if (confirm("Are you sure you want to delete this product?")) {
    eel.delete_product(productName)(function (response) {
      alert(response);
      loadProducts(); // Reload the product list
    });
  }
}
// Function to edit product
function editProduct(Name) {
  // Redirect to edit page or open modal with product data
  // You'll need to create an edit page or modal
  window.location.href = `Updateproduct.html?id=${Name}`;
}
function updateProduct(productName) {
  eel.get_product_details(productName)(function (product) {
    document.getElementById('productName').value = product.name;
    document.getElementById('categoryName').value = product.category;
    document.getElementById('productColor').value = product.productColor;
    document.getElementById('productQuantity').value = product.productQuantity;
    document.getElementById('productDescription').value = product.productDescription;
    document.getElementById('productSize').value = product.productSize;
    document.getElementById('productImage').value = ''; // Clear the file input

    // Change the form submit to update instead of add
    document.querySelector('form').onsubmit = function () {
      updateProductSubmit(productName);
      return false;
    };
  });
}
// Load  products when the page loads
window.onload = function () {
  loadProducts();
};