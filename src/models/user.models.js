import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    phone:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    },
   

},{
    timestamps:true,
})
userSchema.index({ location: '2dsphere' }); // For geospatial queries

const User=mongoose.model('User',userSchema)
export default User