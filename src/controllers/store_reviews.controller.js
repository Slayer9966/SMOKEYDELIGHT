import  StoreReviews  from "../models/customer_reviews.models.js";

export const AddReview = async (req, res) => {
  try {
    const { name, email, review } = req.body;

    // Check if required fields are provided
    if (!name || !email || !review) {
      return res.status(400).json({ message: 'Name, email, and review are required' });
    }

    // Create a new review
    const new_review = new StoreReviews({
      name,
      email,
      review,
    });

    // Save the review to the database
    await new_review.save();

    // Respond with success
    req.flash('success', 'Review added successfully.');

    res.redirect(req.headers.referer || '/menu');    
  } catch (error) {
    console.error('Error adding review:', error);
    // Send error response if headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};

export const ChangeReviewStatus = async (req, res) => {
  try {
    
    const { status,reviewId } = req.body;

    // Check if review ID and status are provided
    if (!reviewId || !status) {
      return res.status(400).json({ message: 'Review ID and status are required' });
    }

    // Fetch the review by ID
    const review = await StoreReviews.findById(reviewId);

    // Check if the review exists
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Update the approval status
    review.approved = status;
    // Save the updated review
    await review.save();

    // Respond with success
    const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
    res.redirect(referer);    
  } catch (error) {
    console.error('Error updating review status:', error);
    // Send error response if headers are not already sent
    if (!res.headersSent) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
};
export const DeleteReview = async (req, res) => {
  const { reviewId } = req.params; // Extract review ID from request parameters

  try {
      // Find the review by ID and delete it
      const deletedReview = await StoreReviews.findByIdAndDelete(reviewId);

      // If the review does not exist, send a 404 error
      if (!deletedReview) {
          return res.status(404).json({ message: 'Review not found' });
      }

      // Send success response
      const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};