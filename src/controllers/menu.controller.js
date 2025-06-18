import Menu from "../models/menu.models.js";
import mongoose from "mongoose";
import category from "../models/category.models.js";

export const AddMenu = async (req, res) => {
  try {
    // Destructure other fields from the request body
    let { name, half_price, full_price, available, description,catId } = req.body;

    // Get the image file from req.file (multer handles this)
    const image = req.file ? req.file.filename : null;

    // Log the values (for debugging)
    console.log(name);
    console.log(half_price);
    console.log(full_price);
    console.log(available);
    console.log(description);
    console.log(image);
    console.log(catId)  // Filename of the uploaded image
    if(available=='Available'){
      available=true;
    }
    else{
      available=false;
    }
    // Create a new instance of the Menu model
    const newMenu = new Menu({
      name,
      half_price,
      full_price,
      available,
      image,  // Store the image filename in the database
      description,
      category: catId,
    });

    // Save the new menu item to the database
    const savedMenu = await newMenu.save();

    // Send a success response

    // Redirect to the previous URL
    const redirectUrl = req.get('Referer') || '/'; // fallback to homepage if no Referer
    res.redirect(redirectUrl);

  } catch (err) {
    // Handle any errors
    console.error('Error saving menu item:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

export const UpdateMenu = async (req, res) => {
  try {

      // Validate the ObjectId format
     

      let { name, half_price, full_price, available, description,id ,catId} = req.body;
      let image;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid menu item ID' });
    }
      // Check if a new image was uploaded
      if (req.file) {
          image = req.file.filename; // Assuming you're using multer and saving the file name
      }
      if(available=='Available'){
        available=true;
      }
      else{
        available=false;
      }
      // Find the menu item by ID and update it
      const updatedMenu = await Menu.findByIdAndUpdate(
          id,
          { 
              name,
              half_price,
              full_price,
              available,
              description,
              category: catId,
              ...(image && { image }) // Only update image if a new one was uploaded
          },
          { new: true, runValidators: true }
      );

      if (!updatedMenu) {
          return res.status(404).json({ message: 'Menu item not found' });
      }

      // Send a success response with the updated menu item
      const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);
  } catch (err) {
      console.error('Error updating menu item:', err.message);
      res.status(500).json({ error: 'Server error' });
  }
};

  export const DeleteMenu = async (req, res) => {
    try {
      const { id } = req.params; // Extract the menu item ID from URL parameters
  
      // Validate the ObjectId format
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid menu item ID' });
      }
  
      // Find the menu item by ID and delete it
      const deletedMenu = await Menu.findByIdAndDelete(id);
  
      if (!deletedMenu) {
        return res.status(404).json({ message: 'Menu item not found' });
      }
  
      // Send a success response
      const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);    } catch (err) {
      console.error('Error deleting menu item:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
  };

  