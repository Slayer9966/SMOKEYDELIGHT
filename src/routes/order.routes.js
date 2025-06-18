import express from 'express';
import { AssignRider, confirm_order, createOrder, deleteOrder, updateOrderStatus } from '../controllers/order.controller.js'; // Ensure the path is correct

const router = express.Router();

// POST route to create a new order
router.post('/create', createOrder);
router.get('/delete/:orderId', deleteOrder);
router.post('/confirm-order',confirm_order);
router.post('/update-order-status',updateOrderStatus);
router.post('/assign-rider',AssignRider)

export default router;
