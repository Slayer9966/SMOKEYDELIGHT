function populateUpdateModal(id, name, image) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
  
    
    // Display the current image in the modal
    document.getElementById('update-image').src = "/uploads/" + image;
    document.getElementById('update-image').alt = name;

    // Show the modal
    $('#UpdateModal').modal('show');
}
