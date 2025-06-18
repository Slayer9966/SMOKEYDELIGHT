import ItemRating from "../models/item_rating.models.js";


export const Rating = async (req, res) => {
    const { name, email, review, rating,item_id } = req.body;
console.log(req.body)
    // Validate input
    if (!name || !email || !review || rating == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Create a new item rating
        const newRating = new ItemRating({
            name,
            email,
            review,
            rating,
            item_id
        });

        // Save the new rating to the database
        await newRating.save();

        // Return success response
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
        res.redirect(referer);
    } catch (error) {
        console.error('Error while submitting rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const RatingStatus = async (req, res) => {
    
    const { approved,ratingId } = req.body; // Assume the body contains whether to approve or not

    // Validate input
    if (approved == null) {
        return res.status(400).json({ message: 'Approval status is required' });
    }

    try {
        // Find the rating by ID
        const rating = await ItemRating.findById(ratingId);

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        // Update the approval status
        rating.Isapproved = approved;

        // Save the changes to the database
        await rating.save();

        // Return success response
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);
    } catch (error) {
        console.error('Error updating rating status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const DeleteReview = async (req, res) => {
    const { reviewId } = req.params; // Extract review ID from request parameters

    try {
        // Find the review by ID and delete it
        const deletedReview = await ItemRating.findByIdAndDelete(reviewId);

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

