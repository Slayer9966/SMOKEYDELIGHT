import category from "../models/category.models.js";

export const AddCategory=async (req,res)=>{
    try{
        const {name}=req.body;
        const image = req.file ? req.file.filename : null;

        const NewCat=new category({
            name,
            image,
        })
        const saved=await NewCat.save()
        const redirectUrl = req.get('Referer') || '/'; // fallback to homepage if no Referer
    res.redirect(redirectUrl);
    }
 catch (err) {
    // Handle any errors
    console.error('Error saving menu item:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
}

export const DeleteCat=async(req,res)=>{
    try{
        const {CatId}=req.params
        const Cat=await category.findByIdAndDelete(CatId);
        if (!Cat) {
            return res.status(404).json({ message: 'Menu item not found' });
          }
      
 const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);    } catch (err) {
      console.error('Error deleting category:', err.message);
      res.status(500).json({ error: 'Server error' });
    }
    
}

export const UpdateCat=async(req,res)=>{
    try{
        const {name,CatId}=req.body
        let image;
        if (req.file) {
            image = req.file.filename; // Assuming you're using multer and saving the file name
        }
        const updatedCat = await category.findByIdAndUpdate(
            CatId,
            { 
                name,
                ...(image && { image }) // Only update image if a new one was uploaded
            },
            { new: true, runValidators: true }
        );
        const referer = req.headers.referer || '/menu'; // Fallback to '/menu' if referer is not present
      res.redirect(referer);
  } catch (err) {
      console.error('Error updating the category:', err.message);
      res.status(500).json({ error: 'Server error' });
  }
    
}