import express from 'express';
import multer from 'multer'; // Ensure multer is imported if you want to use it
import { createWorker, deleteWorker, updateWorker } from '../controllers/worker.controller.js';
import upload from '../util/multerConfig.js';
const router = express.Router();
 // Initialize multer without any storage configuration for form-data

router.post('/create', upload.none(), createWorker); // Add upload.none() to handle form-data
router.post('/update-worker', upload.none(), updateWorker); // Same here
router.get('/delete-worker/:workerId', deleteWorker);

export default router;
