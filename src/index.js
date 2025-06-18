import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import userRoutes from './routes/userRoute.js';
import menuRoutes from './routes/menu.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import workerRoutes from './routes/worker.routes.js'
import StoreReviewRoutes from './routes/store_reviews.routes.js'
import AuthRoutes from './routes/auth.routes.js'
import ItemReviewsRoutes from './routes/itemRating.routes.js'
import AdminRoutes from './routes/admin_page.routes.js'
import PageRoutes from './routes/page.routes.js'
import CategoryRoutes from './routes/category.routes.js'
import http from 'http';
import { Server as socketIo } from 'socket.io';
import session from 'express-session';
import flash from 'connect-flash';
import path from 'path'
import { fileURLToPath } from 'url';
import Notification from './models/notification.models.js'; // Adjust the path as necessary



// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io =new socketIo(server);

// Connect to MongoDB
connectDB();
const __filename = fileURLToPath(import.meta.url);
// Middleware to parse JSON requests
app.use(express.json());


// Middleware to parse URL-encoded data (form data)
app.use(express.urlencoded({ extended: true }));
// Middleware to attach io to requests


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the directory where views (templates) are stored
app.set('views', 'src/views');
app.use('/public', express.static('src/public'));
app.use('/uploads', express.static('src/uploads'));

app.use(session({
  secret: 'slayerdevs', // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true in production if using HTTPS
}));
app.use(flash());

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle real-time order updates
  socket.on('newOrder', (order) => {
    io.emit('orderUpdate', order); // Broadcast to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
      return next(); // User is authenticated
  } else {
      return res.redirect('/login'); // Redirect to login page
  }
};


// Use the imported router for routes under '/api/users'
app.use('/menu',isAuthenticated, menuRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/worker',isAuthenticated, workerRoutes);
app.use('/store-review',StoreReviewRoutes)
app.use('/auth',AuthRoutes)
app.use('/item-rating',isAuthenticated,ItemReviewsRoutes)
app.use('/admin',isAuthenticated,AdminRoutes)
app.use('/category',isAuthenticated,CategoryRoutes)
app.use('/',PageRoutes)

app.get('/get-notifications', async (req, res) => {
  try {
    const notifications = await Notification.find({isRead:false}).sort({ timestamp: -1 });
    res.json(notifications); // Send notifications as JSON
  } catch (error) {
    res.status(500).send('Error retrieving notifications');
  }
});
app.post('/mark-notification-read', async (req, res) => {
  try {
    const { id } = req.body; // Get the ID from the request body
    console.log('Marking notification as read:', id); // Log the ID for debugging
    
    const result = await Notification.updateOne({ _id: id }, { isRead: true });
    
    // Check if the update was successful
    if (result.modifiedCount === 0) {
      return res.status(404).send('Notification not found');
    }

    res.status(200).send('Notification marked as read');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).send('Error marking notification as read');
  }
});


// Define a default route


// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
