import mongoose from "mongoose";
import Cart from "../models/cart.models.js";
import Menu from "../models/menu.models.js";

export const AddToCart = async (req, res) => {
    try {
        // Extract item ID, quantity, and portion from the request body
        const { itemId, quantity, p_quantity ,image,name} = req.body;

        // Validate input
        if (!itemId || !quantity) {
            return res.status(400).json({ message: 'Item ID and quantity are required' });
        }

        // Check if the item exists in the Menu collection
        const menuItem = await Menu.findById(itemId);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Calculate the amount based on the portion (full or half)
        let amount;
        let singleprice;
        if (p_quantity === 'full') {
            amount = quantity * menuItem.full_price;
            singleprice=menuItem.full_price;
        } else {
            amount = quantity * menuItem.half_price;
            singleprice=menuItem.half_price;
        }

        // Check if the cart exists in the session, otherwise initialize it
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Check if the item already exists in the session cart
        const existingItemIndex = req.session.cart.findIndex(cartItem => cartItem.itemId === itemId && cartItem.p_quantity === p_quantity);

        if (existingItemIndex !== -1) {
            // If the item exists, update the quantity and amount
            req.session.cart[existingItemIndex].quantity += quantity;
            req.session.cart[existingItemIndex].amount += amount;
        } else {
            // If the item doesn't exist, add it to the session cart
            req.session.cart.push({
                itemId,
                quantity,
                p_quantity,
                amount,
                image,
                name,
                singleprice
            });
        }

        // Return success response with the updated cart
        res.status(201).json({
            message: 'Item added to cart successfully',
            cart: req.session.cart
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const DeleteCartItem = async (req, res) => {
    try {
        // Extract the item ID and p_quantity from the request body
        const { itemId, p_quantity } = req.body;

        // Validate input
        if (!itemId || !p_quantity) {
            return res.status(400).json({ message: 'Item ID and quantity are required' });
        }

        // Check if the cart exists in the session
        if (!req.session.cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }

        // Find the item in the session cart by both itemId and p_quantity
        const itemIndex = req.session.cart.findIndex(cartItem => cartItem.itemId === itemId && cartItem.p_quantity === p_quantity);

        // Check if the item exists
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        // Calculate the amount of the item to remove from the subtotal
        const itemAmount = req.session.cart[itemIndex].amount; // Ensure that the amount is stored in the cart

        // Remove the item from the session cart
        req.session.cart.splice(itemIndex, 1);

        // Calculate the new subtotal
        const newSubtotal = req.session.cart.reduce((total, item) => total + item.amount, 0).toFixed(2); // Assuming amount is a number

        // Return success response with the updated cart and new subtotal
        res.status(200).json({
            message: 'Cart item deleted successfully',
            cart: req.session.cart,
            newSubtotal: newSubtotal // Return the new subtotal
        });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const UpdateCart = async (req, res) => {
    const { itemId, quantity, p_quantity } = req.body;

    if (!itemId || quantity === undefined || p_quantity === undefined) {
        return res.status(400).json({ message: 'Invalid request' });
    }

    // Find the item in the cart matching both itemId and p_quantity
    const cartItem = req.session.cart.find(item => item.itemId === itemId && item.p_quantity === p_quantity);
    if (!cartItem) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Update the quantity and amount
    cartItem.quantity = quantity;
    cartItem.amount = cartItem.singleprice * quantity; // Assuming you have price information

    // Calculate the new subtotal
    const newSubtotal = req.session.cart.reduce((acc, item) => acc + item.amount, 0);

    // Return the new subtotal to update the UI
    res.json({ success: true, newSubtotal: newSubtotal });
};
