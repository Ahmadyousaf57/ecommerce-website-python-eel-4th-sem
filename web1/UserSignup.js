// // function verifyAccess() {
// //     const SignData = {
// //         n: document.getElementById('name').value,
// //         e: document.getElementById('email').value,
// //         p: document.getElementById('password').value,
// //         a: parseInt(document.getElementById('age').value),
// //         g: document.getElementById('gender').value,
// //         ad_cus: document.getElementById('admins+customer').value,
// //         d: document.getElementById('dob').value,
// //     };
// //     eel.Signup(SignData);
// // }

// function verifyAccess() {
//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;
//     const profileImage = document.getElementById('profileImage').files[0];
//     const password = document.getElementById('password').value;
//     const age = parseInt(document.getElementById('age').value);
//     const gender = document.getElementById('gender').value;
//     const ad_cus = document.getElementById('admins+customer').value;
//     const dob = document.getElementById('dob').value;
//     // Convert image to base64 for storage
// const reader = new FileReader();
// reader.onload = function(event) {
//   const imageBase64 = event.target.result;
//     // Assuming you have a function in your backend to handle the image upload
//     eel.Signup(name, email, imageBase64, password, age, gender, ad_cus,dob)(function (response) {
//       alert(response);
//       document.getElementById('name').value = ''; // Clear the input field
//       document.getElementById('email').value = '';
//       document.getElementById('profileImage').value = '';
//       document.getElementById('password').value = '';
//       document.getElementById('age').value = '';
//       document.getElementById('gender').value = '';
//       document.getElementById('admins+customer').value = '';
//       document.getElementById('dob').value = '';
//     //   loadProducts(); // Reload the product list
//     });
//   }
//   reader.readAsDataURL(profileImage);
// }
function verifyAccess() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const profileImage = document.getElementById('profileImage').files[0];
  const password = document.getElementById('password').value;
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const ad_cus = document.getElementById('admins+customer').value;
  const dob = document.getElementById('dob').value;
  
  // Convert image to base64 for storage
  const reader = new FileReader();
  reader.onload = function(event) {
      const imageBase64 = event.target.result;
      // Assuming you have a function in your backend to handle the image upload
      eel.Signup(name, email, imageBase64, password, age, gender, ad_cus, dob)(function(response) {
          alert(response);
          document.getElementById('name').value = ''; // Clear the input field
          document.getElementById('email').value = '';
          document.getElementById('profileImage').value = '';
          document.getElementById('password').value = '';
          document.getElementById('age').value = '';
          document.getElementById('gender').value = '';
          document.getElementById('admins+customer').value = '';
          document.getElementById('dob').value = '';
      });
  }
  reader.readAsDataURL(profileImage);
}

// Add event listener to calculate age when DOB is selected
document.getElementById('dob').addEventListener('change', function() {
  const dob = new Date(this.value);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
  }
  
  // Set the calculated age in the age field
  document.getElementById('age').value = age;
});