import express from 'express'
import upload from '../util/multerConfig.js';

import { AddCategory,DeleteCat,UpdateCat } from '../controllers/category.controller.js'
const router=express.Router()

router.post('/add-category',upload.single('image'),AddCategory)
router.post('/update-category',upload.single('image'),UpdateCat)
router.get('/delete-category/:CatId',DeleteCat)

export default router