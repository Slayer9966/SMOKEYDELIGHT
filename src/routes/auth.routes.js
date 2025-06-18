import { Login,logout,Register } from "../controllers/auth.controller.js"
import express from 'express'

const router=express.Router()

router.post('/login',Login)
router.post('/register',Register)
router.get('/logout',logout)

export default router;