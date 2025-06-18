import category from "../models/category.models.js";
import Menu from "../models/menu.models.js";
import Order from "../models/order.models.js";
import StoreReviews from "../models/customer_reviews.models.js";

export const mainPage = async (req, res) => {

   try{
    const store_reviews=await StoreReviews.find({approved:true})
    res.render('index', { currentRoute: '/index'
        , successMessage: req.flash('success'),
        errorMessage: req.flash('error'),
        reviews:store_reviews
     });
   }
   catch(error){
    console.error('Error:', error);
        res.status(500).send('An error occurred .');
   }
}

export const AboutPage = async (req, res) => {
    res.render('about', { currentRoute: '/about',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const BookingPage = async (req, res) => {
    res.render('booking', { currentRoute: '/booking',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const ContactPage = async (req, res) => {
    res.render('contact', { currentRoute: '/contact',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const TeamPage = async (req, res) => {
    res.render('team', { currentRoute: '/teams',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const TestimonialPage = async (req, res) => {
    res.render('testimonial', { currentRoute: '/testimonial',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const ServicePage = async (req, res) => {
    res.render('service', { currentRoute: '/service',
        successMessage: req.flash('success'),
        errorMessage: req.flash('error')
     });
}

export const MenuPage = async (req, res) => {
    try {
        // Fetch all menu items from the database
        const menuItems = await Menu.find().populate('category');; // This will return all menu items
        const categories=await category.find();
        // Send the data to the 'AddMenu' page
        res.render('menu', { 
            currentRoute: '/pagemenu', 
            menuItems: menuItems,
            categories:categories ,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('An error occurred while fetching the menu items.');
    }
}
export const ProductPage= async (req,res)=>{
    try{
        const{MenuId}=req.params;
        const item= await Menu.findById(MenuId).populate('category');
        if (!item) {
            return res.status(404).send('Menu item not found');
        }
        const relatedItems = await Menu.find({
            category: item.category,
            _id: { $ne: item._id }  // Exclude the current item itself
        });
        res.render('ProductPage',{
            currentRoute:`/product/${item._id}`,
            item:item,
            relatedItems: relatedItems,
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        })
    }
    catch(error) {
        console.error('Error fetching menu items:', error);
        res.status(500).send('An error occurred while fetching the menu item.');
    }
}
export const CartPage = async (req, res) => {
    try {
        // Retrieve the cart from the session
        const cart = req.session.cart || []; // Default to an empty array if the cart is not defined
        console.log(cart)
        // Check if the cart is empty
        if (cart.length === 0) {
            return res.render('cart', { cartItems: [], totalAmount: 0, currentRoute: '/cart',   successMessage: req.flash('success'),
                errorMessage: req.flash('error') });
        }

        // Calculate the total amount of the cart
        let totalAmount = 0;
        cart.forEach(item => {
            totalAmount += item.amount;
        });

        // Render the cart page, passing the cart items and total amount to the view
        res.render('cart', {
            cartItems: cart,
            totalAmount: totalAmount,
            currentRoute: '/cart',
            successMessage: req.flash('success'),
            errorMessage: req.flash('error')
        });
    } catch (error) {
        console.error('Error rendering the cart page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const OrderConfirmation=async (req,res)=>{
    try{
        const {orderId}=req.params;
        const expires = req.query.expires;

    // Check if the expiration timestamp is present and valid
    if (!expires || Date.now() > parseInt(expires)) {
        // Link has expired or no expiration timestamp provided
        return res.status(400).send('This confirmation link has expired.');
    }
        const order=await Order.findById(orderId)
        if(!order){
            return res.status(404).send('Order not found.');
        }
        res.render('orderConfirmation',{
            orderId:orderId,
            order:order
        })
    }
    catch(error){
        console.error('Error rendering the cart page:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
export const LoginPage = async (req, res) => {
    res.render('login');
};

