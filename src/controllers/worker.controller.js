import mongoose from "mongoose";
import Worker from "../models/workers.models.js";

export const createWorker = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the entire body to check what's coming in
        let { name, phone, email, isVerified } = req.body;

        // Validate input
        if (!name || !phone || !email) {
            return res.status(400).json({ message: 'Name, phone, and email are required' });
        }
        
        // Convert isVerified to boolean
        isVerified = isVerified === 'verified'; 

        // Create a new worker
        const worker = new Worker({ name, phone, email, isVerified });
        await worker.save();

        // Return success response
        res.status(201).json({ message: 'Worker created successfully', worker });
    } catch (error) {
        console.error('Error creating worker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getWorkerById = async (req, res) => {
    try {
        const { workerId } = req.params;
        const worker = await Worker.findById(workerId);

        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);
    } catch (error) {
        console.error('Error fetching worker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const updateWorker = async (req, res) => {
    try {
        console.log("Request Body:", req.body)
        const { workerId, name, phone, email, isVerified } = req.body; // Extract worker ID and other fields from request body
        console.log("Received workerId:", workerId); // Log the worker ID

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

        // Create an object to hold the update data, ensuring only relevant fields are included
        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (email) updateData.email = email;
        if (isVerified !== undefined) updateData.isVerified = isVerified === 'verified'; // Convert string to boolean

        // Find and update the worker by ID
        const updatedWorker = await Worker.findByIdAndUpdate(workerId, updateData, { new: true });

        // If the worker does not exist, return a 404 response
        if (!updatedWorker) {
            return res.status(404).json({ message: 'Worker not found' });
        }

        // Return success response with the updated worker
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
        res.redirect(referer);
    } catch (error) {
        console.error('Error updating worker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const deleteWorker = async (req, res) => {
    try {
        const { workerId } = req.params;
        const worker = await Worker.findByIdAndDelete(workerId);

        if (!mongoose.Types.ObjectId.isValid(workerId)) {
            return res.status(400).json({ message: 'Invalid worker ID format' });
        }

        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);
    } catch (error) {
        console.error('Error deleting worker:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};