import express from 'express';
import { AddToCart, DeleteCartItem, UpdateCart } from '../controllers/cart.controller.js';
const router = express.Router();

router.post('/addCart',AddToCart)
router.delete('/deleteCart',DeleteCartItem)
router.post('/update-cart',UpdateCart)


export default router;