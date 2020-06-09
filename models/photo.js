var mongoose=require("mongoose");
var photoSchema=new mongoose.Schema({
    image:String
});
module.exports=mongoose.model("photo",photoSchema);