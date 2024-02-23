// wishlist model
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    email: String,
    plantids: [String],
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist