import mongoose from "mongoose";
import category from './category.models.js'; // Lowercase 'category'

const MenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    half_price: {
        type: Number,
        required: true,
    },
    full_price: {
        type: Number,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category' // Lowercase 'category' to match the import
    }
},
{ timestamps: true });

const Menu = mongoose.model('Menu', MenuSchema);
export default Menu;
