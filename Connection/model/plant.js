const mongoose = require("mongoose")

let pl = mongoose.Schema;
const plantdetailsschema = new pl({
    plantid: String,
    plantname: String,
    planttypeid: String,
    color: String,
    size: String,
    price: Number,
    description: String,
    stock: Number,
    plantphoto: String,
    status:String
});

var plantdetailsmodel = mongoose.model("Plant", plantdetailsschema)
module.exports = plantdetailsmodel;