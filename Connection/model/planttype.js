const mongoose =require("mongoose")

let sc=mongoose.Schema;
const plantschema=new sc({
    Planttype:String,
    Planttypephoto: String,
    Status:String
});

var plantmodel=mongoose.model("Planttype",plantschema)
module.exports=plantmodel;