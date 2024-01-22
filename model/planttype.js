const mongoose =require("mongoose")

mongoose.connect("mongodb+srv://bloomingbuds245:bloomingbuds@cluster0.h4nmndz.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>{console.log("DB connected")})
.catch(err=>console.log(err));


let sc=mongoose.Schema;
const plantschema=new sc({
    Planttype:String,
    Status:String
});

var plantmodel=mongoose.model("Planttype",plantschema)
module.exports=plantmodel;