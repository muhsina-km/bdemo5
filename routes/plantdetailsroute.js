
const multer = require('multer');
const plantdetailsmodel = require('../model/plant');
const app = require('express').Router()
const cloudinary = require('cloudinary').v2;


// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dffttd77v',
  api_key: '244724649513297',
  api_secret: 'MfjVzbS-TJad378kJUwsMqTrCNg'
});

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/pnew', async (request, response) => {
    try {
    const { plantid,plantname,planttypeid,color,size,price,description,stock,status,plantphoto } = request.body;
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
        plantphoto
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
    console.log(request.params.id);
    let id = request.params.id;
  
    // Ensure that 'plantdetailsmodel' is properly imported and defined.
    await plantdetailsmodel.findByIdAndUpdate(id, request.body);
  
    response.send("Record Updated");
  });
  


app.post('/uploadimg', upload.single('image'), (req, res) => {
    cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
      } else {
        console.log(result);
        res.json({ imageUrl: result.secure_url });
      }
    }).end(req.file.buffer);
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


module.exports =app