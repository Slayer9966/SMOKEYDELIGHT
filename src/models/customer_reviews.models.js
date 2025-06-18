import mongoose from "mongoose";

const CustomerReviewSchema=new mongoose.Schema({
    name:{
        type:String,
      },
    approved:{
        type:Boolean,
        default:false
    },
    email:{
        type:String
    },
    review:{
        type:String
    }

},{timestamps:true})

const StoreReviews=mongoose.model('StoreReviews',CustomerReviewSchema)
export default StoreReviews