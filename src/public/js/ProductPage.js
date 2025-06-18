document.addEventListener('DOMContentLoaded', function() {
    const fullQuantity = document.getElementById('fullQuantity');
    const halfQuantity = document.getElementById('halfQuantity');
    const productPrice = document.querySelectorAll('.productPrice');
    const fullPrice = parseFloat(document.getElementById('fullPriceValue').value);
    const halfPrice = parseFloat(document.getElementById('halfPriceValue').value);

    // Function to update price based on selected quantity
    function updatePrice() {
        productPrice.forEach(priceElement => {
            if (halfQuantity.checked) {
                priceElement.textContent = halfPrice;
            } else if (fullQuantity.checked) {
                priceElement.textContent = fullPrice;
            }
        });
    }

    // Add event listeners to radio buttons
    fullQuantity.addEventListener('change', updatePrice);
    halfQuantity.addEventListener('change', updatePrice);
    const addToCartForm = document.getElementById('addToCartForm');
    const quantityInput = document.getElementById('quantity');
    const increaseButton = document.getElementById('increaseQuantity');
    const decreaseButton = document.getElementById('decreaseQuantity');

    // Increase quantity
    increaseButton.addEventListener('click', function() {
        let currentQuantity = parseInt(quantityInput.value);
        quantityInput.value = currentQuantity + 1;
    });

    // Decrease quantity
    decreaseButton.addEventListener('click', function() {
        let currentQuantity = parseInt(quantityInput.value);
        if (currentQuantity > 1) {
            quantityInput.value = currentQuantity - 1;
        }
    });

    // Form submission
    addToCartForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Get the necessary data from the form
        const itemId = document.getElementById('itemId').value;
        const p_quantity = document.querySelector('input[name="p_quantity"]:checked').value;
        const quantity = parseInt(quantityInput.value);
        const image=document.getElementById('item_image').value;
        const name=document.getElementById('item_name').value;

        // Make the AJAX request to the AddToCart controller
        try {
            const response = await fetch('/cart/addCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ itemId, quantity, p_quantity,image,name })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Item added to cart successfully!');
                console.log('Cart:', result.cart); // Check the updated cart in the console
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    });
});
