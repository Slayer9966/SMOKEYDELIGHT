import express from 'express'
import { addEmployeePage, addMenuPage, cancelledOrdersPage, CategoryPage, completedOrdersPage, DashboardPage, ItemReviewPage, Login, OrderItemsPage, OutForDelivery, pendingOrdersPage, StoreReviewPage, unconfirmedOrders } from '../controllers/adminPage.controller.js';

const router = express.Router();

router.get('/menu',addMenuPage)
router.get('/employees',addEmployeePage)
router.get('/dashboard',DashboardPage)
router.get('/login',Login)
router.get('/cancelled-orders',cancelledOrdersPage)
router.get('/completed-orders',completedOrdersPage)
router.get('/pending-orders',pendingOrdersPage)
router.get('/order-items/:orderId',OrderItemsPage)
router.get('/item-reviews/:item_id',ItemReviewPage)
router.get('/customer-reviews',StoreReviewPage)
router.get('/categories',CategoryPage)
router.get('/out-for-delivery-orders',OutForDelivery)
router.get('/unconfirmed-orders',unconfirmedOrders)



export default router