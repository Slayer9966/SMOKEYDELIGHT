import Order from "../models/order.models.js";
import OrderItem from "../models/order_item.models.js";
import Menu from "../models/menu.models.js";
import sendEmail from '../mail.js'; // Import your generalized mail function
import Worker from "../models/workers.models.js";
import Notification from "../models/notification.models.js";

export const createOrder = async (req, res) => {
  try {
    const { delivery_address, email, phone } = req.body;

    // Validate input
    if (!delivery_address || !email || !phone) {
      return res.status(400).json({ message: 'Delivery address, email, and phone are required' });
    }

    // Extract cart items from the session (or request)
    const cartItems = req.session.cart || []; // Assuming cart is stored in session

    // Check if the cart has items
    if (!cartItems.length) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Calculate total order amount and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (let item of cartItems) {
      const menuItem = await Menu.findById(item.itemId); // Fetch menu item details using itemId

      if (!menuItem) {
        return res.status(404).json({ message: `Menu item with ID ${item.itemId} not found` });
      }

      // Calculate item amount based on portion (full or half)
      let itemAmount = 0;
      if (item.p_quantity === 'full') {
        itemAmount = item.quantity * menuItem.full_price;
      } else {
        itemAmount = item.quantity * menuItem.half_price;
      }

      totalAmount += itemAmount;

      // Create order item for each cart item
      const newOrderItem = new OrderItem({
        order: null, // This will be updated after creating the order
        item: item.itemId,
        quantity: item.quantity,
        amount: itemAmount,
      });

      orderItems.push(newOrderItem);
    }

    // Create new order with default status `pending`
    const order = new Order({
      order_number: Date.now(), // Generate a unique order number
      order_amount: totalAmount,
      delivery_charges: 0, // You can calculate or add delivery charges here
      total_amount: totalAmount, // Total amount including delivery charges
      delivery_address,
      phone,
      email,
      confirmed: false,  // Initially set to false
      order_status: 'pending', // Default status
    });

    // Save the order to the database
    await order.save();

    // Save order items and link them to the order
    for (let orderItem of orderItems) {
      orderItem.order = order._id; // Set the order reference in each item
      await orderItem.save();
    }

    // Clear cart from session after order is created
    req.session.cart = [];

    // Send confirmation email using the generalized sendEmail function
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const confirmationLink = `http://localhost:3000/order-confirmation/${order._id}?expires=${expirationTime}`;
    const emailContent = `
      <h1>Confirm Your Order</h1>
      <p>Please confirm your order by clicking the link below:</p>
      <a href="${confirmationLink}">Confirm Order</a>
    `;
    await sendEmail(email, 'Confirm Your Order', emailContent);
    const newNotification = new Notification({
      message: `New order received: ${order.order_number}`,
      isRead: false
    });
  
    newNotification.save()
    .then(() => {
      // Emit notification to the connected users
      req.io.emit('newNotification', { 
        _id: newNotification._id, 
        message: newNotification.message, 
        createdAt: newNotification.createdAt // Ensure this field is correct
      });
    });
    // Return success response with the order details
    req.flash('success', 'Order created successfully.');

    res.redirect(req.get('referer') || '/');
    // Notify connected clients about the new order using Socket.io if available
    
  } catch (error) {
    req.flash('error', 'Order creation failed.');
    res.redirect(req.get('referer') || '/');
  }
};

export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // Extract order ID from request parameters

        // Find the order by ID
        const order = await Order.findById(orderId);

        // If the order does not exist, return a 404 response
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Delete the order using the document's deleteOne method to trigger the pre hook
        await order.deleteOne();

        // Return a success response
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
        res.redirect(referer);     } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        // Extract order ID from request parameters
        const { newStatus,orderId } = req.body; // Extract new status from request body
console.log("ell")
        // Find the order by ID
        const order = await Order.findById(orderId);

        // If the order does not exist, return a 404 response
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (newStatus === 'outForDelivery' && !order.rider) {
          return res.status(400).json({ message: "Cannot change to 'Out for Delivery' without assigning a rider." });
      }
      if(newStatus==='completed' && !order.rider){
        return res.status(400).json({
          message:"Cannot chage to 'completed' without assigning a rider"
        })
      }
        // Update the order status
        order.order_status = newStatus;
        await order.save(); // Save the updated order
        let email=order.email
        let  amount=order.total_amount
        let content
        let subject='Order Updates'
        if(order.order_status==='outForDelivery'){
            content=`Your order is on the way plz make this ${amount} amount ready`
            

        }
        else if(order.order_status==='cancelled'){
              content=`Your order has been cancelled`
        }
        else if(order.order_status==='completed'){
          content=`Your order has been delivered successfully`
        }
       
        
        await sendEmail(email, subject, content);

        // Return a success response with the updated order
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
        res.redirect(referer);    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const confirm_order=async(req,res)=>{
    try {
    const {orderId}=req.body;
    const order=await Order.findById(orderId)
    order.confirmed=true;
    order.confirmed_time = Date.now();
    await order.save()
    res.status(200).json({ message: "Your order has been confirmed", order });
} catch (error) {
    console.error("Error confirming the order:", error);
    res.status(500).json({ message: "Internal server error" });
}
}



  export const AssignRider = async (req, res) => {
    try {
        const { orderId, riderId } = req.body; // Extract order ID and rider ID from the request body

        // Find the order by its ID
        const order = await Order.findById(orderId);

        // Check if the order exists
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Find the rider by their ID
        const rider = await Worker.findById(riderId); // Assuming you have a Rider model

        // Check if the rider exists
        if (!rider) {
            return res.status(400).json({ message: "Rider not found" });
        }

        // Assign the rider to the order
        order.rider = rider;

        // Save the updated order
        await order.save();

        // Optionally, send a notification to the rider or customer
        // let email = order.email;
        // let subject = 'Rider Assigned';
        // let content = `A rider has been assigned to your order #${order.order_number}. Your order will be delivered soon.`;

        // // Send email notification to the customer
        // await sendEmail(email, subject, content);

        // Return a success response
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
        res.redirect(referer); 
          } catch (error) {
        console.error("Error assigning rider:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

  
