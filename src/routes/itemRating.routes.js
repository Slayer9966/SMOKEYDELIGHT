import express from 'express'
import { Rating, RatingStatus,DeleteReview } from '../controllers/item_rating.controller.js';

const router = express.Router();

router.post('/addIRating',Rating)
router.post('/changeRStatus',RatingStatus)
router.get('/delete-review/:reviewId', DeleteReview);


export default router
