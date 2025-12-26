function addProduct() {
    const productName = document.getElementById('productName').value;
    const categoryName = document.getElementById('categoryName').value;
    const productImage = document.getElementById('productImage').files[0];
    const productColor = document.getElementById('productColor').value;
    const productQuantity = document.getElementById('productQuantity').value;
    const productDescription = document.getElementById('productDescription').value;
    const productDiscount = parseInt(document.getElementById('productDiscount').value);
    const productPrice = parseInt(document.getElementById('productPrice').value);
    const productDelveryprice = parseInt(document.getElementById('productDelveryPrice').value);
    const productReturnday = document.getElementById('srd').value;
    const productSize = document.getElementById('productSize').value;
    // Convert image to base64 for storage
const reader = new FileReader();
reader.onload = function(event) {
  const imageBase64 = event.target.result;
    // Assuming you have a function in your backend to handle the image upload
    eel.add_product(productName, categoryName, imageBase64, productColor, productQuantity, productDescription, productSize,productPrice,productDelveryprice,productReturnday,productDiscount)(function (response) {
      alert(response);
      document.getElementById('productName').value = ''; // Clear the input field
      document.getElementById('categoryName').value = '';
      document.getElementById('productImage').value = '';
      document.getElementById('productColor').value = '';
      document.getElementById('productQuantity').value = '';
      document.getElementById('productDescription').value = '';
      document.getElementById('productSize').value = '';
      document.getElementById('productDiscount').value = '';
      document.getElementById('productPrice').value='';
      document.getElementById('productDelveryPrice').value='';
      document.getElementById('srd').value='';
      loadProducts(); // Reload the product list
    });
  }
  reader.readAsDataURL(productImage);
}
// the are used for fetch data from the database and load into add product form
function loadCategories() {
    eel.get_categories()(function (categories) {
      let select = document.getElementById('categoryName');
      categories.forEach(category => {
        let option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
      });
    });
  }
   // Load categories and products when the page loads
   window.onload = function () {
    loadCategories();
  };