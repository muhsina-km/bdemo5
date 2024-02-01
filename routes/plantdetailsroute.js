
const multer = require('multer');
const plantdetailsmodel = require('../model/plant');
const app = require('express').Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/pnew', upload.single('plantphoto'), async (request, response) => {
    try {
    const { plantid,plantname,planttypeid,color,size,price,description,stock,status } = request.body;
    console.log(request.body);
    const newdata = new plantdetailsmodel({
        plantid,
        plantname,
        planttypeid,
        color,
        size,
        price,
        description,
        stock,
        status,
        plantphoto: {
            data: request.file.buffer,
            contentType: request.file.mimetype,
        }
    })
    console.log(newdata)
    await newdata.save();
    response.json({message:"Record Saved"});
} catch(error) {
    console.error("Error saving data to Mongodb:",error);
    response.status(500).json({error:"Internal Server Error"})
}

});


//for retrieving plant data

app.get('/pview', async (request, response) => {
    // try {
      console.log("djfhj")
        const result=await plantdetailsmodel.aggregate([
            {
                $lookup: {
                    from: 'planttypes',
                    localField: 'planttypeid',
                    foreignField: '_id',
                    as: 'types',
                },
            },
        ]);

response.send(result)

    // } catch(error) {
    //     console.error("Error in /pview:",error);
    //     response.status(500).json({error:"Internal error"})
    // }
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


module.exports =app