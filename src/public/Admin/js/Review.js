
  // Function to extract reviewId from the URL
  function getReviewIdFromUrl() {
    const url = window.location.href; // Get the current URL
    const urlParts = url.split('/');  // Split the URL by "/"
    const reviewId = urlParts[urlParts.length - 1]; // Get the last part which is the reviewId
    return reviewId;
  }

  // Set the reviewId in the hidden input field
  document.getElementById('reviewIdInput').value = getReviewIdFromUrl();

