async function deleteCartItem(itemId, p_quantity) {
    try {
        const response = await fetch('/cart/deleteCart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ itemId, p_quantity }), // Send itemId and p_quantity as JSON
        });

        if (response.ok) {
            const data = await response.json(); // Get the response data

            // Remove the item from the DOM if deletion is successful
            const itemCard = document.getElementById(`item-${itemId}-${p_quantity}`);
            itemCard.remove();

            // Update the subtotal displayed in the UI
            const subtotalDisplay = document.getElementById('subtotal');
            subtotalDisplay.innerText = `Subtotal: $${data.newSubtotal}`; // Update subtotal display

            console.log('Item deleted successfully');
        } else {
            const errorData = await response.json();
            console.error('Error deleting item:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function updateQuantity(itemId, action, p_quantity) {
    // Get the quantity input and amount display elements
    const quantityInput = document.getElementById(`quantity-${itemId}-${p_quantity}`);
    const amountDisplay = document.getElementById(`amount-${itemId}-${p_quantity}`);

    // Get current quantity and parse it to an integer
    let currentQuantity = parseInt(quantityInput.value);

    // Update the quantity based on action
    if (action === 'increase') {
        currentQuantity++;
    } else if (action === 'decrease') {
        currentQuantity = currentQuantity > 0 ? currentQuantity - 1 : 0; // prevent negative values
    }

    // Update the input value
    quantityInput.value = currentQuantity;

    // Calculate the new amount
    const pricePerItem = parseFloat(document.getElementById(`price-${itemId}-${p_quantity}`).value); // Ensure price is parsed as float
    const newAmount = (pricePerItem * currentQuantity).toFixed(2);
    amountDisplay.innerText = `$${newAmount}`;

    // Send AJAX request to update the quantity in the server
    fetch('cart/update-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            itemId: itemId,
            quantity: currentQuantity,
            p_quantity:p_quantity,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update the subtotal if returned from server
            document.getElementById('subtotal').innerText = `Subtotal: $${data.newSubtotal.toFixed(2)}`;
        } else {
            alert('Error updating cart');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const successMessage = urlParams.get('success');

  // If there's a success message, show the modal
  if (successMessage) {
    // Set the message text in the modal
    document.getElementById('successMessage').textContent = successMessage;

    // Initialize and show the Bootstrap modal
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
  }


    // Order submission form
    // document.getElementById('orderForm').addEventListener('submit', async function(event) {
    //     event.preventDefault(); // Prevent default form submission
    
    //     const form = event.target;
    //     const formData = new FormData(form); // Create FormData object from the form
        
    //     // Convert the FormData object into a regular object
    //     const formObject = {};
    //     formData.forEach((value, key) => {
    //         formObject[key] = value;
    //     });
    
    //     try {
    //         console.log('Sending form data:', formObject);
    //         const response = await fetch('/order/create', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(formObject) // Send form data as JSON
    //         });
    
    //         const result = await response.json();
    
    //         if (response.ok) {
    //             alert('Order created successfully: ' + result.message);
    //             // Optionally, close the modal or redirect the user
    //             location.reload(); // For example, you can reload the page or update the UI
    //         } else {
    //             alert('Error: ' + result.message);
    //         }
    //     } catch (error) {
    //         alert('An error occurred while submitting the form.');
    //         console.error(error);
    //     }
    // });
}
