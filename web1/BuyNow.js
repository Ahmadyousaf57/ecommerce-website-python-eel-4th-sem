// Load cart items when page loads
document.addEventListener('DOMContentLoaded', function () {
    loadOrderSummary();
});

function loadOrderSummary() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        window.location.href = 'CustomerMain.html';
        return;
    }
    eel.get_cart_items(sessionId)(function (items) {
        const orderItemsContainer = document.getElementById('orderItems');
        let subtotal = 0;
        let delivery = 0;

        if (items.length === 0) {
            orderItemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        orderItemsContainer.innerHTML = '';
        items.forEach(item => {
            const discountAmount = item.price * (item.discount / 100);
            const discountedPrice = item.price - discountAmount;
            const itemTotal = discountedPrice * item.quantity;
            subtotal += itemTotal;
            delivery += item.delivery_price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>${itemTotal.toFixed(2)} RS</span>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' RS';
        document.getElementById('delivery').textContent = delivery.toFixed(2) + ' RS';
        document.getElementById('total').textContent = (subtotal + delivery).toFixed(2) + ' RS';
    });
}
// function placeOrder() {
//     const sessionId = localStorage.getItem('sessionId');
//     if (!sessionId) {
//         window.location.href = 'CustomerMain.html';
//         return;
//     }

//     eel.get_cart_items(sessionId)(function(items) {
//         if (items.length === 0) {
//             alert('Your cart is empty');
//             return;
//         }

//         // Calculate totals
//         let subtotal = 0;
//         let delivery = 0;

//         items.forEach(item => {
//             const discountAmount = item.price * (item.discount / 100);
//             const discountedPrice = item.price - discountAmount;
//             subtotal += discountedPrice * item.quantity;
//             delivery += item.delivery_price * item.quantity;
//         });

//         const total = subtotal + delivery;

//         const customerInfo = {
//             sessionId: sessionId,
//             name: document.getElementById('name').value,
//             email: document.getElementById('email').value,
//             phone: document.getElementById('phone').value,
//             country: document.getElementById('country').value,
//             province: document.getElementById('province').value,
//             city: document.getElementById('city').value,
//             district: document.getElementById('district').value,
//             zipcode: document.getElementById('zipcode').value,
//             address: document.getElementById('address').value,
//             payment: document.getElementById('payment').value,
//             subtotal: subtotal,
//             delivery: delivery,
//             total: total
//         };

//         // Validate form
//         if (!customerInfo.name || !customerInfo.email || !customerInfo.phone ||
//             !customerInfo.country || !customerInfo.province || !customerInfo.city ||
//             !customerInfo.district || !customerInfo.address || !customerInfo.payment) {
//             alert('Please fill all required fields');
//             return;
//         }

//         eel.place_order(customerInfo)(function(response) {
//             alert('Order placed successfully!');
//             // Optionally redirect to confirmation page
//         });
//     });
// }
// function placeOrder() {
//     const sessionId = localStorage.getItem('sessionId');
//     if (!sessionId) {
//         window.location.href = 'CustomerMain.html';
//         return;
//     }

//     eel.get_cart_items(sessionId)(function (items) {
//         if (items.length === 0) {
//             alert('Your cart is empty');
//             return;
//         }

//         // Calculate totals
//         let subtotal = 0;
//         let delivery = 0;

//         items.forEach(item => {
//             const discountAmount = item.price * (item.discount / 100);
//             const discountedPrice = item.price - discountAmount;
//             subtotal += discountedPrice * item.quantity;
//             delivery += item.delivery_price * item.quantity;
//         });

//         const total = subtotal + delivery;
//         const paymentMethod = document.getElementById('payment').value;

//         // Collect payment details based on method
//         let paymentDetails = {};
//         switch (paymentMethod) {
//             case 'JazzCash':
//             case 'EasyPaisa':
//                 paymentDetails = {
//                     mobileNumber: document.getElementById('mobileNumber').value,
//                     transactionId: document.getElementById('transactionId').value,
//                     accountNumber: document.getElementById('accountNumber').value
//                 };
//                 break;

//             case 'DebitCard':
//                 paymentDetails = {
//                     cardNumber: document.getElementById('cardNumber').value,
//                     expiryDate: document.getElementById('expiryDate').value,
//                     cvv: document.getElementById('cvv').value,
//                     cardHolder: document.getElementById('cardHolder').value
//                 };
//                 break;

//             case 'PayPal':
//                 paymentDetails = {
//                     paypalEmail: document.getElementById('paypalEmail').value
//                 };
//                 break;
//         }

//         const customerInfo = {
//             sessionId: sessionId,
//             name: document.getElementById('name').value,
//             email: document.getElementById('email').value,
//             phone: document.getElementById('phone').value,
//             country: document.getElementById('country').value,
//             province: document.getElementById('province').value,
//             city: document.getElementById('city').value,
//             district: document.getElementById('district').value,
//             zipcode: document.getElementById('zipcode').value,
//             address: document.getElementById('address').value,
//             payment: paymentMethod,
//             subtotal: subtotal,
//             delivery: delivery,
//             total: total,
//             ...paymentDetails
//         };

//         // Validate form
//         if (!validateOrderForm(customerInfo, paymentMethod)) {
//             return;
//         }
//         // In your placeOrder function, update the success handler:
//         eel.place_order(customerInfo)(function (response) {
//             if (response && response.orderId) {
//                 window.location.href = 'ShippingProcess.html?orderId=' + response.orderId;
//             } else {
//                 alert('Order placed but no order ID received');
//                 window.location.href = 'CustomerMain.html';
//             }
//         });
//     });
// }
function placeOrder() {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        window.location.href = 'CustomerMain.html';
        return;
    }

    eel.get_cart_items(sessionId)(function(items) {
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        // Calculate totals
        let subtotal = 0;
        let delivery = 0;
        
        items.forEach(item => {
            const discountAmount = item.price * (item.discount / 100);
            const discountedPrice = item.price - discountAmount;
            subtotal += discountedPrice * item.quantity;
            delivery += item.delivery_price * item.quantity;
        });

        const total = subtotal + delivery;
        const paymentMethod = document.getElementById('payment').value;

        // Collect payment details based on method
        let paymentDetails = {};
        switch(paymentMethod) {
            case 'JazzCash':
            case 'EasyPaisa':
                paymentDetails = {
                    mobileNumber: document.getElementById('mobileNumber').value,
                    transactionId: document.getElementById('transactionId').value,
                    accountNumber: document.getElementById('accountNumber').value
                };
                break;
                
            case 'DebitCard':
                paymentDetails = {
                    cardNumber: document.getElementById('cardNumber').value,
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value,
                    cardHolder: document.getElementById('cardHolder').value
                };
                break;
                
            case 'PayPal':
                paymentDetails = {
                    paypalEmail: document.getElementById('paypalEmail').value
                };
                break;
        }

        const customerInfo = {
            sessionId: sessionId,
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            country: document.getElementById('country').value,
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            district: document.getElementById('district').value,
            zipcode: document.getElementById('zipcode').value,
            address: document.getElementById('address').value,
            payment: paymentMethod,
            subtotal: subtotal,
            delivery: delivery,
            total: total,
            ...paymentDetails
        };

        // Validate form
        if (!validateOrderForm(customerInfo, paymentMethod)) {
            return;
        }

        // eel.place_order(customerInfo)(function(response) {
        //     if (response && response.success && response.orderId) {
        //         alert('Order placed successfully!');
        //         window.location.href = 'ShippingProcess.html?orderId=' + response.orderId;
        //     } else {
        //         alert('Error placing order: ' + (response.error || 'Unknown error'));
        //     }
        // });
        eel.place_order(customerInfo)(function(response) {
            if (response && response.success && response.orderId) {
                alert('Order placed successfully!');
                window.location.href = 'ShippingProcess.html?orderId=' + response.orderId;
            } else {
                alert('Error placing order: ' + (response.error || 'Unknown error'));
            }
        });
    });
}
function validateOrderForm(data, paymentMethod) {
    // Basic validation
    const requiredFields = ['name', 'email', 'phone', 'country', 'province',
        'city', 'district', 'address'];

    for (const field of requiredFields) {
        if (!data[field]) {
            alert(`Please fill in the ${field} field`);
            return false;
        }
    }

    // Payment method specific validation
    switch (paymentMethod) {
        case 'JazzCash':
        case 'EasyPaisa':
            if (!data.mobileNumber || !data.transactionId) {
                alert('Please provide mobile number and transaction ID');
                return false;
            }
            break;

        case 'DebitCard':
            if (!data.cardNumber || !data.expiryDate || !data.cvv || !data.cardHolder) {
                alert('Please provide all card details');
                return false;
            }
            break;

        case 'PayPal':
            if (!data.paypalEmail) {
                alert('Please provide your PayPal email');
                return false;
            }
            break;
    }

    return true;
}
