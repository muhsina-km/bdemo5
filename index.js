const express = require("express");
const cors = require("cors");

const planttyperouter = require('./routes/Planttyperoute')
const wishrouter = require('./routes/wishroutes')
const loginrouter = require('./routes/loginroute')
const plantDetailsrouter = require('./routes/plantdetailsroute')
const registerrouter = require('./routes/registerroute')
const cartrouter = require('./routes/cartroute')
const orderrouter = require('./routes/orderroute')
const db = require("./Connection/Database")


const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API creation
app.get('/', (request, response) => {
    response.send("Hai");
});


//PLANT TYPE

app.use("/planttype", planttyperouter)

// Login route

app.use("/login", loginrouter)

//PLANT Details

app.use("/plantdetails",plantDetailsrouter)

//REGISTER

app.use("/register", registerrouter)

//CART

app.use("/cart", cartrouter)

// WishList

app.use("/wishlist", wishrouter)

//Order 

app.use("/order", orderrouter)

// Assign port
app.listen(4005, () => {
    console.log("Port is running on 4005");
});
