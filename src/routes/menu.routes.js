import express from 'express';
import upload from '../util/multerConfig.js';
import { AddMenu,UpdateMenu,DeleteMenu } from '../controllers/menu.controller.js';
const router = express.Router();

router.post('/addMenu',upload.single('image'),AddMenu)
router.post('/update-menu',upload.single('image'), UpdateMenu);
router.get('/delete-menu/:id', DeleteMenu);

export default router;