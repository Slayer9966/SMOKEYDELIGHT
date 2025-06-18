import Menu from "../models/menu.models.js";
import Worker from "../models/workers.models.js";
import ItemRating from "../models/item_rating.models.js";
import StoreReviews from "../models/customer_reviews.models.js"
import category from "../models/category.models.js";
import Order from "../models/order.models.js";
import OrderItem from "../models/order_item.models.js";
import Notification from "../models/notification.models.js";

export const addMenuPage = async (req, res) => {
    try {
        // Fetch all menu items from the database
        const menuItems = await Menu.find().populate('category');; // This will return all menu items
        const categories=await category.find();
        // Send the data to the 'AddMenu' page
        res.render('Admin/AddMenu', { 
            currentRoute: '/menu', 
            menuItems: menuItems,
            categories:categories 
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('An error occurred while fetching the menu items.');
    }
};

export const addEmployeePage = async (req, res) => {
    try {
        // Fetch all workers
        const workers = await Worker.find();

        // Render the AddEmployee page and pass the workers data
        res.render('Admin/AddEmployee', {
            currentRoute: '/employees',
            workers // Pass the workers data to the template
        });
    } catch (error) {
        console.error('Error fetching workers for Add Employee page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const DashboardPage = async (req, res) => {
    // Get unread notifications
    const notifications = await Notification.find({ isRead: false });
    
    // Get the start and end of today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Start of day

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // End of day

    // Total sales (all time)
    const totalSalesResult = await Order.aggregate([
        { $match: { order_status: 'completed' } },
        { $group: { _id: null, totalAmount: { $sum: "$order_amount" } } }
    ]);
    const totalSales = totalSalesResult.length > 0 ? totalSalesResult[0].totalAmount : 0;

    // Today's sales
    const todaySalesResult = await Order.aggregate([
        { 
            $match: { 
                order_status: 'completed',
                createdAt: { $gte: todayStart, $lte: todayEnd } 
            } 
        },
        { $group: { _id: null, totalAmount: { $sum: "$order_amount" } } }
    ]);
    const todaySales = todaySalesResult.length > 0 ? todaySalesResult[0].totalAmount : 0;

    // Calculate yesterday's sales
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1); // Start of yesterday
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1); // End of yesterday

    const yesterdaySalesResult = await Order.aggregate([
        { 
            $match: { 
                order_status: 'completed',
                createdAt: { $gte: yesterdayStart, $lte: yesterdayEnd } 
            } 
        },
        { $group: { _id: null, totalAmount: { $sum: "$order_amount" } } }
    ]);
    const yesterdaySales = yesterdaySalesResult.length > 0 ? yesterdaySalesResult[0].totalAmount : 0;

    // Compare today's sales with yesterday's sales
    let todayPercentageDifference = 0;
    if (yesterdaySales > 0) {
        todayPercentageDifference = ((todaySales - yesterdaySales) / yesterdaySales) * 100;
    } else if (yesterdaySales === 0 && todaySales > 0) {
        todayPercentageDifference = 100;
    }

    let todayComparisonClass = '';
    let todayComparisonSign = '';

    if (todayPercentageDifference >= 0) {
        todayComparisonClass = 'text-success';
        todayComparisonSign = '+';
    } else {
        todayComparisonClass = 'text-danger';
        todayComparisonSign = '-';
    }

    // Weekly sales comparison
    const currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay()); // Start of week
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6); // End of week
    currentWeekEnd.setHours(23, 59, 59, 999);

    const lastWeekStart = new Date(currentWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Start of last week

    const lastWeekEnd = new Date(currentWeekEnd);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7); // End of last week

    const currentWeekSalesResult = await Order.aggregate([
        { 
            $match: { 
                order_status: 'completed',
                createdAt: { $gte: currentWeekStart, $lte: currentWeekEnd } 
            } 
        },
        { $group: { _id: null, totalAmount: { $sum: "$order_amount" } } }
    ]);
    const currentWeekSales = currentWeekSalesResult.length > 0 ? currentWeekSalesResult[0].totalAmount : 0;

    const lastWeekSalesResult = await Order.aggregate([
        { 
            $match: { 
                order_status: 'completed',
                createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd } 
            } 
        },
        { $group: { _id: null, totalAmount: { $sum: "$order_amount" } } }
    ]);
    const lastWeekSales = lastWeekSalesResult.length > 0 ? lastWeekSalesResult[0].totalAmount : 0;

    // Weekly sales percentage comparison
    let percentageDifference = 0;
    if (lastWeekSales > 0) {
        percentageDifference = ((currentWeekSales - lastWeekSales) / lastWeekSales) * 100;
    } else if (lastWeekSales === 0 && currentWeekSales > 0) {
        percentageDifference = 100;
    }

    let comparisonClass = '';
    let comparisonSign = '';

    if (percentageDifference >= 0) {
        comparisonClass = 'text-success';
        comparisonSign = '+';
    } else {
        comparisonClass = 'text-danger';
        comparisonSign = '-';
    }

    // Compare number of orders (current week vs last week)
    const currentWeekOrdersResult = await Order.countDocuments({
        order_status: 'completed',
        createdAt: { $gte: currentWeekStart, $lte: currentWeekEnd }
    });
    const lastWeekOrdersResult = await Order.countDocuments({
        order_status: 'completed',
        createdAt: { $gte: lastWeekStart, $lte: lastWeekEnd }
    });

    let orderPercentageDifference = 0;
    if (lastWeekOrdersResult > 0) {
        orderPercentageDifference = ((currentWeekOrdersResult - lastWeekOrdersResult) / lastWeekOrdersResult) * 100;
    } else if (lastWeekOrdersResult === 0 && currentWeekOrdersResult > 0) {
        orderPercentageDifference = 100;
    }

    let orderComparisonClass = '';
    let orderComparisonSign = '';

    if (orderPercentageDifference >= 0) {
        orderComparisonClass = 'text-success';
        orderComparisonSign = '+';
    } else {
        orderComparisonClass = 'text-danger';
        orderComparisonSign = '-';
    }

    const workerCount = await Worker.countDocuments();
    
// Monthly sales calculation for the current year
const currentYear = new Date().getFullYear();
const monthlySalesResult = await Order.aggregate([
    { 
        $match: { 
            order_status: 'completed',
            createdAt: {
                $gte: new Date(currentYear, 0, 1), // Start of the current year
                $lt: new Date(currentYear + 1, 0, 1) // Start of the next year
            }
        } 
    },
    {
        $group: {
            _id: { $month: "$createdAt" }, // Group by month
            totalAmount: { $sum: "$order_amount" } // Sum the order amounts
        }
    },
    {
        $sort: { _id: 1 } // Sort by month
    }
]);

// Initialize monthly sales array
const monthlySales = Array(12).fill(0); // For each month from Jan(0) to Dec(11)

// Populate the monthly sales data
monthlySalesResult.forEach(sale => {
    monthlySales[sale._id - 1] = sale.totalAmount; // _id is the month number (1-12)
});
const currentWeekOrders = currentWeekOrdersResult;
    // Render the dashboard with all the data
    res.render('Admin/Dashboard', { 
        currentRoute: '/dashboard', 
        notifications, 
        totalSales, 
        todaySales,
        todayPercentageDifference: Math.abs(todayPercentageDifference).toFixed(2),
        todayComparisonClass,
        todayComparisonSign,
        currentWeekSales, 
        percentageDifference: Math.abs(percentageDifference).toFixed(2),
        comparisonClass,
        comparisonSign,
        currentWeekOrdersResult,
        lastWeekOrdersResult,
        orderPercentageDifference: Math.abs(orderPercentageDifference).toFixed(2),
        orderComparisonClass,
        orderComparisonSign,
        workerCount,
        monthlySales,
        currentWeekOrders, // Pass the current week's order count

    });
};



export const Login = async (req, res) => {
    res.render('Admin/login', { currentRoute: '/login' });
}

export const cancelledOrdersPage = async (req, res) => {
    try{
        const Orders=await Order.find({order_status:'cancelled'})
        const Riders=await Worker.find()

        res.render('Admin/cancelledOrders', { currentRoute: '/cancelled-orders',orders:Orders,riders:Riders });
    
    }
    catch(error){
        console.error("Error retrieving item ratings:", error);
        res.status(500).send("Internal Server Error");
    }
   
}

export const completedOrdersPage = async (req, res) => {
    try{
        const Orders=await Order.find({confirmed:true,order_status:'completed'})
        const Riders=await Worker.find()

        res.render('Admin/completedOrders', { currentRoute: '/completed-orders',orders:Orders,riders:Riders });
    
    }
    catch(error){
        console.error("Error retrieving item ratings:", error);
        res.status(500).send("Internal Server Error");
    }
    
}

export const pendingOrdersPage = async (req, res) => {
try{
    const Orders=await Order.find({confirmed:true,order_status:'pending'})
    const Riders=await Worker.find()
    res.render('Admin/pendingOrders', { currentRoute: '/pending-orders',orders:Orders,riders:Riders });

}
catch(error){
    console.error("Error retrieving item ratings:", error);
    res.status(500).send("Internal Server Error");
}

}
export const OutForDelivery=async (req,res)=>{
    try{
        const Orders=await Order.find({confirmed:true,order_status:'outForDelivery'})
        const Riders=await Worker.find()

        res.render('Admin/OutForDeliveryOrders', { currentRoute: '/out-for-delivery-orders',orders:Orders,riders:Riders });
    
    }
    catch(error){
        console.error("Error retrieving item ratings:", error);
        res.status(500).send("Internal Server Error");
    }
}
export const unconfirmedOrders=async (req,res)=>{
   try{
    const Orders=await Order.find({confirmed:false})
    res.render('Admin/unconfirmedOrders',{
        currentRoute:'/unconfirmed-orders',
        orders:Orders
    })
   }
   catch(error){
    console.error("Error retrieving item ratings:", error);
    res.status(500).send("Internal Server Error");
   }
}

export const OrderItemsPage = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch the order items that match the orderId
        const orderItems = await OrderItem.find({ order: orderId }).populate('item'); // Assuming 'order_id' is the foreign key in the OrderItem model

        // If no order items are found, return a message or empty array
        if (!orderItems.length) {
            return res.render('Admin/OrderItems', {
                currentRoute: '/order-items',
                orderItems: [],
                orderId,
                message: 'No items found for this order.'
            });
        }

        // Fetch the order details if needed
        const order = await Order.findById(orderId);

        // Render the template and pass the order items
        res.render('Admin/OrderItems', {
            currentRoute: '/order-items',
            orderItems,
            orderId: order._id,
            orderNumber: order.order_number // Pass order number for reference
        });
    } catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const ItemReviewPage = async (req, res) => {
    const { item_id } = req.params;

    try {
        // Assuming ItemRating is your model and it has a method to find ratings by item_id
        const ratings = await ItemRating.find({ item_id: item_id });

        // Render the ItemReviews page and pass the ratings to the view
        res.render('Admin/ItemReviews', {
            currentRoute: '/item-reviews',
            ratings: ratings // Pass the ratings to the view
        });
    } catch (error) {
        console.error("Error retrieving item ratings:", error);
        res.status(500).send("Internal Server Error");
    }
};
export const StoreReviewPage=async(req,res)=>{
    try{
        const reviews = await StoreReviews.find();
        res.render('Admin/StoreReviews', { 
            currentRoute: '/store-reviews', 
            reviews:reviews // Pass the menu items to the view
        });
    }
    catch (error) {
        console.error("Error retrieving item ratings:", error);
        res.status(500).send("Internal Server Error");

    }

}
export const CategoryPage=async(req,res)=>{
    try{
        const categories=await category.find()
        res.render('Admin/AddCategory',{
            currentRoute:'/categories',
            categories:categories
        })
    }
    catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).send("Internal Server Error");

    }
}


