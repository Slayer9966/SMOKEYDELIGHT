import mongoose from "mongoose";
import Menu from "./menu.models.js";

const cartSchema=new mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu'
    },
    quantity:{
        type:Number,
    },
    amount: {
        type: Number,
        required: true,
    }
},{timestamps:true})

const Cart=mongoose.model('Cart',cartSchema)
export default Cart