// // function loadProducts() {
// //   eel.get_products()(function (products) {
// //     const productList = document.getElementById('productsGrid11');
// //     productList.innerHTML = '';
// //     products.forEach(product => {
// //       disc = product.productDiscount / 100;
// //       dis = product.productPrice * disc;
// //       discount = product.productPrice - dis;
// //       const card = document.createElement('div');
// //       card.className = 'product-card';
// //       card.innerHTML = `
// //         <img src="${product.productImage}" alt="${product.name}" class="product-image">
// //                   <h3>Title : ${product.name}</h3>
// //                   <p> Discription : ${product.productDescription}</p>
// //                    <p class="dress-card-para">Category: ${product.category}</p>
// //                               <p class="dress-card-para" style="text-decoration: line-through;">Price: ${product.productPrice}</p>
// //                               <p class="dress-card-para">DisCount Price: ${discount}</p>
// //                               <button onclick="Login('${product.name}')" class="update-btn">ADDTOCART</button>
// //                   `;
// //       productList.appendChild(card);
// //     });
// //   });
// // }
// // function Login(Name) {
// //   // Redirect to edit page or open modal with product data
// //   // You'll need to create an edit page or modal
// //   window.location.href = `Login.html?id=${Name}`;
// // }
// function loadProducts() {
//   eel.get_products()(function (products) {
//     const productList = document.getElementById('productsGrid11');
//     productList.innerHTML = '';
//     products.forEach(product => {
//       disc = product.productDiscount / 100;
//       dis = product.productPrice * disc;
//       discount = product.productPrice - dis;
//       const card = document.createElement('div');
//       card.className = 'product-card';
//       card.innerHTML = `
//         <img src="${product.productImage}" alt="${product.name}" class="product-image">
//         <h3>${product.name}</h3>
//         <p class="product-description">${product.productDescription}</p>
//         <button class="see-more-btn">See More</button>
//         <p class="dress-card-para">Category: ${product.category}</p>
//         <div class="price-container">
//           <span class="original-price">$${product.productPrice.toFixed(2)}</span>
//           <span class="discount-price">$${discount.toFixed(2)}</span>
//         </div>
//         <button onclick="Login('${product.name}')" class="update-btn">ADD TO CART</button>
//       `;
//       productList.appendChild(card);
//     });

//     // Add event listeners for "See More" buttons
//     document.querySelectorAll('.see-more-btn').forEach(button => {
//       button.addEventListener('click', function() {
//         const description = this.previousElementSibling;
//         description.classList.toggle('expanded');
//         this.textContent = description.classList.contains('expanded') ? 'See Less' : 'See More';
//       });
//     });
//   });
// }

// function Login(Name) {
//   window.location.href = `Login.html?id=${Name}`;
// }  
function loadProducts() {
  eel.get_products()(function (products) {
    const productList = document.getElementById('productsGrid11');
    productList.innerHTML = '';
    
    products.forEach(product => {
      // Calculate discount price
      const discountAmount = product.productPrice * (product.productDiscount / 100);
      const discountedPrice = product.productPrice - discountAmount;
      
      // Format description with "See More" functionality
      const maxLength = 100;
      const fullDescription = product.productDescription;
      const shortDescription = fullDescription.length > maxLength 
        ? fullDescription.substring(0, maxLength) + '...' 
        : fullDescription;
      
      // Create product card
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-badge">${product.productDiscount}% OFF</div>
        <div class="product-image-container">
          <img src="${product.productImage}" alt="${product.name}" class="product-image" loading="lazy">
        </div>
        <div class="product-content">
          <h3 class="product-title">${product.name}</h3>
          <div class="product-category">${product.category}</div>
          
          <div class="product-description-container">
            <p class="product-description">
              <span class="description-text" data-full="${fullDescription}">${shortDescription}</span>
              ${fullDescription.length > maxLength 
                ? `<span class="see-more">See More</span>` 
                : ''}
            </p>
          </div>
          
          <div class="product-pricing">
            <span class="original-price">$${product.productPrice.toFixed(2)}</span>
            <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>
          </div>
          
          <button onclick="showProductDetails('${product.name}')" class="product-button">
            View Details
            <svg class="button-icon" viewBox="0 0 24 24">
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
            </svg>
          </button>
        </div>
      `;
      productList.appendChild(card);
    });

    // Add event listeners to "See More" buttons
    document.querySelectorAll('.see-more').forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDescription(this);
      });
    });
  });
}

function toggleDescription(element) {
  const descriptionContainer = element.closest('.product-description-container');
  const descriptionText = descriptionContainer.querySelector('.description-text');
  const fullText = descriptionText.dataset.full;
  
  if (element.textContent === 'See More') {
    descriptionText.textContent = fullText;
    element.textContent = 'See Less';
    descriptionContainer.classList.add('expanded');
  } else {
    const shortText = fullText.substring(0, 100) + '...';
    descriptionText.textContent = shortText;
    element.textContent = 'See More';
    descriptionContainer.classList.remove('expanded');
  }
}

function showProductDetails(Name) {
  window.location.href = `ProductDetails.html?id=${Name}`;
}