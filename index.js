const express = require("express");
const cors = require("cors");
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const loginModel = require("./model/login");
const plantdetailsmodel = require("./model/plant");
const plantmodel= require("./model/planttype");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API creation
app.get('/', (request, response) => {
    response.send("Hai");
});

// Login route

app.post('/login', async (request, response) => {
    const { username, password } = request.body;

    try {
        const user = await loginModel.findOne({ username, password });

        if (user) {
            // Successful login
            response.status(200).json({ message: "Login successful" });
        } else {
            // Invalid credentials
            response.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Internal server error" });
    }
});


//PLANT
//for saving plant data

app.post('/pnew', 
upload.single('plantphoto'), async (request, response) => {
    try {
    const { plantid,plantname,planttype,color,size,price,description,stock,status } = request.body;
    console.log(request.body);
    const newdata = new plantdetailsmodel({
        plantid,
        plantname,
        planttype,
        color,
        size,
        price,
        description,
        stock,
        status,
        plantphoto: {
            data: request.file.buffer,
            contentType: request.file.mimetype,
        },
    })
    await newdata.save();
    response.json({message:"Record Saved"});
} catch(error) {
    console.error("Error saving data to Mongodb:",error);
    response.status(500).json({error:"Internal Server Error"})
}
});


//for retrieving plant data

app.get('/pview', async (request, response) => {
    try {
        var data = await plantdetailsmodel.find();
    response.send(data)
    } catch(error) {
        console.error("Error in /pview:",error);
        response.status(500).json({error:"Internal error"})
    }
});

//for update status of plant-delete 

app.put('/updatestatus/:id',async(request,response)=>{
    let id=request.params.id
    await plantdetailsmodel.findByIdAndUpdate(id, { $set:{status:"INACTIVE"} });
    response.send("Record Deleted")
})

//for modifying the plant details 

app.put('/pedit/:id', async (request, response) => {
    let id = request.params.id
    await plantdetailsmodel.findByIdAndUpdate(id, request.body)
    response.send("Record Updated")
})


//PLANT TYPE

app.post('/ptnew', (request, response) => {
    new plantmodel(request.body).save()
    response.send("Success")
})


app.get('/ptview', async (request, response) => {
    var data = await plantmodel.find();
    response.send(data)
})

app.put('/ptupdatestatus/:id', async (request, response) => {
    let id = request.params.id
    await plantmodel.findByIdAndUpdate(id, { $set: { Status: "INACTIVE" } })
    response.send("Record Deleted")
})

app.put('/ptedit/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const updatedData = request.body;
        console.log(updatedData)
        // Validate if the plant with the given ID exists
        const existingPlant = await plantdetailsmodel.findById(id);
        await plantmodel.findOneAndUpdate({ _id: id }, { $set: updatedData });
        if (!existingPlant) {
            return response.status(404).json({ message: "Plant not found" });
        }
        await plantdetailsmodel.findByIdAndUpdate(id, { $set: updatedData });
        response.json({ message: "Record Updated" });
    } catch (error) {
        console.error("Error updating plant details:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

// get platdetails from id
app.get('/platdetails/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const plantDetails = await plantdetailsmodel.findById(id);
        console.log(plantDetails);
        if (!plantDetails) {
            return response.status(404).json({ message: "Plant details not found" });
        }
        response.json("blaaa");
    } catch (error) {
        console.error("Error retrieving plant details:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});




// Assign port
app.listen(3005, () => {
    console.log("Port is running on 3005");
});
