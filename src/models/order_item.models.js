import mongoose from "mongoose";
import Order from "./order.models.js"; // Ensure the path is correct
import Menu from "./menu.models.js";   // Ensure the path is correct

const orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order', // Reference to the Order model
        required: true,
    },
    item: {
        type: mongoose.Schema.Types.ObjectId, // Corrected typo
        ref: 'Menu', // Reference to the Menu model
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const OrderItem = mongoose.model("OrderItem", orderItemSchema);
export default OrderItem;
