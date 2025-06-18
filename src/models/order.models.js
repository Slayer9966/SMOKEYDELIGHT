import mongoose from "mongoose";
import OrderItem from "./order_item.models.js";
import Worker from "./workers.models.js";
import User from "./user.models.js";

const orderSchema=new mongoose.Schema({
    order_number:{
        type:Number,
        unique:true,
    },
    order_amount:{
        type:Number,

    },
    delivery_charges:{
        type:Number,
    },
    total_amount:{
        type:Number,
    },
    delivery_address:{
        type:String,
    },
    rider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Worker',
        default: null
    },
    order_status:{
        type:String,
        default:"pending"
    },
    confirmed:{
        type:Boolean,
        default:false
    },
    phone:{
      type:String,
      required:true
    }
    ,
    email:{
      type:String,
      required:true
    },
    confirmed_time: {
        type: Date,
        default: null // You can use null if you want it to be empty initially
    },
    store:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"User"
    }


},{timestamps:true})
orderSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        // Delete all associated order items when an order is deleted
        await OrderItem.deleteMany({ order: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model("Order", orderSchema);
export default Order;