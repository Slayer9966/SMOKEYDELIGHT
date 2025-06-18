
    function filterItems(categoryId) {
        var items = document.querySelectorAll('.menu-item');
        
        items.forEach(function(item) {
            if (categoryId === 'all') {
                item.style.display = 'block'; // Show all items
            } else if (item.getAttribute('data-category') === categoryId) {
                item.style.display = 'block'; // Show items of the selected category
            } else {
                item.style.display = 'none'; // Hide items that don't match the category
            }
        });
    }
