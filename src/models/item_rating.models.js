import mongoose from "mongoose";
import Menu from "./menu.models.js";

const Item_Review_Schema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    Isapproved:{
        type:Boolean,
        default:false
    },
    rating:{
        type:Number,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    item_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Menu'
    }
},{timestamps:true})

const ItemRating=mongoose.model('ItemRating',Item_Review_Schema)
export default ItemRating
