function populateUpdateModal(id, name, full_price, half_price, description, available, image) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updateFullPrice').value = full_price;
    document.getElementById('updateHalfPrice').value = half_price;
    document.getElementById('updateDescription').value = description;
    document.getElementById('updateAvailability').value = available;
    
    // Display the current image in the modal
    document.getElementById('update-image').src = "/uploads/" + image;
    document.getElementById('update-image').alt = name;

    // Show the modal
    $('#UpdateModal').modal('show');
}
