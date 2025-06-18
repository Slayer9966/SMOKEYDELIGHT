import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.models.js'; // Adjust the path as necessary


// Login Route
export const Login= async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create a session (if using express-session)
        req.session.userId = user._id;
        req.session.isAdmin = user.isAdmin; // Store isAdmin in session

        // Redirect based on isAdmin field
        if (user.isAdmin) {
            res.redirect('/admin/dashboard')
        } else {
            res.status(200).json({ message: 'Login successful', redirect: '/store-panel' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const Register = async (req, res) => {
    const { email, password, phone, name } = req.body;

    // Validate input
    if (!email || !password || !phone || !name) {
        return res.status(400).json({ message: 'Email, password, phone, and name are required' });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            email,
            password: hashedPassword,
            phone,
            name,
          
        });

        // Save the new user to the database
        await newUser.save();

        // Respond with success
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ message: 'Logout failed. Please try again.' });
        }

        // Optionally, clear cookies (if using cookies to store session)
        res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name

        // Redirect to the login page or send a success response
        res.redirect('/login');    });
};


