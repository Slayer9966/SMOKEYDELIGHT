import express from 'express';
import { AddReview, ChangeReviewStatus,DeleteReview } from '../controllers/store_reviews.controller.js';

const router = express.Router();


router.post('/addReview',AddReview),
router.post('/approved',ChangeReviewStatus)
router.get('/delete-review/:reviewId', DeleteReview);



export default router;
