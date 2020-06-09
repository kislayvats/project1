var mongoose=require("mongoose");
var passportlocalmogoose=require("passport-local-mongoose");
var userSchema=mongoose.Schema({
   username:String,
    password:String,
    image:String,
    email:{type:String, unique:true, required:true},
    isAdmin:{type:Boolean,default:false}
});
userSchema.plugin(passportlocalmogoose);
module.exports=mongoose.model("User",userSchema);
