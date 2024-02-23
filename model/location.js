const mongoose = require("mongoose")

const locationSchema = new mongoose.Schema({
    name : String,
    address : String,
    place : String,
    district : String,
    phone : String
});

const locationModel = mongoose.model('location',locationSchema);

module.exports = locationModel;