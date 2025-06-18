import upload from "../util/multerConfig.js";
import User from '../models/user.models.js'; 



export const renderAddUserPage=(req,res)=>{
    res.render('AddUsers')
}

export const AddUser = (req, res) => {
  // Use multer to upload the image
  upload.single('image')(req, res, async function (err) {
    if (err) {
      // Handle multer error
      return res.status(400).send('Error uploading image: ' + err.message);
    }

    // If no file was uploaded
    if (!req.file) {
      return res.status(400).send('No image uploaded.');
    }

    // Extract form data from the request body
    const { name, email, phone } = req.body;

    // Create a new user object using the User model
    const newUser = new User({
      name: name,
      email: email,
      phone: phone,
      image: req.file.path,  // Store the image file path in the image field
    });

    try {
      // Save the new user to the database
      await newUser.save();

      // Send success response
      res.redirect('/login');
    } catch (error) {
      // Handle any errors, like validation or duplicate fields
      res.status(500).send('Error saving user: ' + error.message);
    }
  });
};

export const showUser = (req, res) => {
  User.find()
    .then(users => {
      res.render('index', { users }); // Render the 'users' view and pass the users data
    })
    .catch(error => {
      res.status(500).send("Error fetching users");
    });
};
export const GetUser=(req,res)=>{
  User.findById(id)
}
