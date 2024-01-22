const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://bloomingbuds245:bloomingbuds@cluster0.h4nmndz.mongodb.net/test?retryWrites=true&w=majority")
    .then(() => { console.log("DB connected") })
    .catch(err => console.log(err));

let pl = mongoose.Schema;
const plantdetailsschema = new pl({
    plantid: String,
    plantname: String,
    planttype: String,
    color: String,
    size: String,
    price: Number,
    description: String,
    stock: Number,
    plantphoto:{
        data : Buffer,
        contentType:String,
    },
    status:String
});

var plantdetailsmodel = mongoose.model("Plant", plantdetailsschema)
module.exports = plantdetailsmodel;