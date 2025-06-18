import mongoose from "mongoose";

const CategorySchema=new mongoose.Schema({

    name:{
        type:String,
        unique:true,
        required:true,
        },
    image:{
        type:String,
        required:true,
    }
},{
    timestamps:true
})

const category=mongoose.model('category',CategorySchema)

export default category

