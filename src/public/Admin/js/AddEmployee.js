function populateUpdateModal(id, name, email,phone) {
    document.getElementById('updateId').value = id;
    document.getElementById('updateName').value = name;
    document.getElementById('updatePhone').value = phone;
    document.getElementById('updateEmail').value = email;
    
    // Display the current image in the modal
   

    // Show the modal
    $('#UpdateModal').modal('show');
}
