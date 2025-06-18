import express from 'express';
import { AboutPage, BookingPage, CartPage, ContactPage, LoginPage, mainPage, MenuPage, OrderConfirmation, ProductPage, ServicePage, TeamPage, TestimonialPage } from '../controllers/pages.controller.js';

const router = express.Router();

router.get('/index',mainPage)
router.get('/pagemenu',MenuPage)
router.get('/service',ServicePage)
router.get('/contact',ContactPage)
router.get('/teams',TeamPage)
router.get('/testimonial',TestimonialPage)
router.get('/about',AboutPage)
router.get('/booking',BookingPage)
router.get('/product/:MenuId',ProductPage)
router.get('/cart',CartPage)
router.get('/order-confirmation/:orderId',OrderConfirmation)
router.get('/login',LoginPage)

export default router