// Load categories from database
function loadCategories() {
  eel.get_categories()(function (categories) {
      let select = document.getElementById('categoryName');
      select.innerHTML = '<option value="">Select Category</option>'; // Reset options
      categories.forEach(category => {
          let option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          select.appendChild(option);
      });
  });
}

// Load product data when page loads
window.onload = function () {
  loadCategories();
  const productName = getProductNameFromUrl();
  if (productName) {
      updateProduct(productName);
  }
};

function updateProduct(productName) {
  eel.get_product_details(productName)(function (product) {
      document.getElementById('productName').value = product.name;
      document.getElementById('categoryName').value = product.category;
      document.getElementById('productColor').value = product.productColor;
      document.getElementById('productQuantity').value = product.productQuantity;
      document.getElementById('productDescription').value = product.productDescription;
      document.getElementById('productSize').value = product.productSize;
      document.getElementById('productDiscount').value = product.productDiscount;
      document.getElementById('productPrice').value = product.productPrice;
      document.getElementById('productDelveryPrice').value = product.productDelveryPrice;
      document.getElementById('srd').value = product.productReturnDays;
  });
}

function updateProductSubmit() {
  const oldProductName = getProductNameFromUrl();
  const productNameNew = document.getElementById('productName').value;
  const categoryName = document.getElementById('categoryName').value;
  const productImageInput = document.getElementById('productImage');
  const productColor = document.getElementById('productColor').value;
  const productQuantity = document.getElementById('productQuantity').value;
  const productDescription = document.getElementById('productDescription').value;
  const productSize = document.getElementById('productSize').value;
  const productDiscount = parseInt(document.getElementById('productDiscount').value);
  const productPrice = parseInt(document.getElementById('productPrice').value);
  const productDelveryprice = parseInt(document.getElementById('productDelveryPrice').value);
  const productReturnday = document.getElementById('srd').value;

  // Check if a new image was uploaded
  if (productImageInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function(event) {
          const imageBase64 = event.target.result;
          eel.update_product(
              oldProductName, productNameNew, categoryName, imageBase64, 
              productColor, productQuantity, productDescription, productSize,
              productPrice, productDelveryprice, productReturnday, productDiscount
          )(function(response) {
              alert(response);
              window.location.href = "./ViewProduct.html";
          });
      };
      reader.readAsDataURL(productImageInput.files[0]);
  } else {
      // No new image, use the existing one
      eel.update_product(
          oldProductName, productNameNew, categoryName, null, 
          productColor, productQuantity, productDescription, productSize,
          productPrice, productDelveryprice, productReturnday, productDiscount
      )(function(response) {
          alert(response);
          window.location.href = "./ViewProduct.html";
      });
  }
}