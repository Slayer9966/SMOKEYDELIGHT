import express from 'express';
import { renderAddUserPage,AddUser, showUser } from '../controllers/crud.controller.js';
const router = express.Router();

// Render the EJS template for the /login route
router.get('/login',showUser);

// Define other routes
router.get('/regi', renderAddUserPage);
router.post('/add',AddUser)

export default router;
