const express = require("express");
const cors = require("cors");

const planttyperouter = require('./routes/Planttyperoute')
const loginrouter = require('./routes/loginroute')
const plantDetailsrouter = require('./routes/plantdetailsroute')
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




// Assign port
app.listen(4005, () => {
    console.log("Port is running on 4005");
});
