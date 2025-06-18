import mongoose from "mongoose";

const workerSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
        unique:true,
    }
    ,
    email:{
        type:String,
        required:true,
        unique:true,
    },
    isVerified:{
        type:Boolean
    }
},{timestamps:true})

const Worker=mongoose.model("Worker",workerSchema)

export default Worker