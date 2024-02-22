
const multer = require('multer');
const plantdetailsmodel = require('../model/plant');
const { identifyPlant } = require('../functions/aiPlant');
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

// retrive a specific plant's details from it's id
app.get('/pview/:id', async (request, response) => {
    const id = request.params.id;
    const result = await plantdetailsmodel.find({ plantid: id });
    response.json(result);
});

// for searching and retrieving plant details from a query string
app.get('/searchplants/:query', async (request, response) => {
  const query = request.params.query; // Access the route parameter correctly
  try {
      const result = await plantdetailsmodel
          .find({plantname: {$regex: query, $options: 'i'}})
          .limit(10)
          .select('-_id'); // Exclude _id field, you can include/exclude fields as needed
      response.json(result);
  } catch (error) {
      response.status(500).json({ message: error.message });
  }
});

// Endpoint to get plant details by category
app.get('/products/:category', async (req, res) => {
  const category = req.params.category;

  try {
    const result = await plantdetailsmodel
    .find({plantname: {$regex: category, $options: 'i'}});
    if (result.length === 0) {
      return res.status(404).json({ message: 'No results found' });
    }

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//for fetching plant from specific plant type
app.get('/ptview/:id', async (request, response) => {
    const id = request.params.id;
    const result = await plantdetailsmodel.find({ planttypeid: id });
    response.json(result);
});

//for retrieving plant data

app.get('/pview/', async (request, response) => {
    // try {
      console.log("hmmm")
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
  

  app.post('/imgdetails', async (request, response) => {
    try {
      const imageUrl = request.body.url;
      console.log(imageUrl);
      const result = await identifyPlant(`${imageUrl}`);
      response.json(result);
    } catch (error) {
      // console.error('Error:', error);
      response.status(500).json({ error: error.message });
    }
  });

  app.post('/uploadimg', upload.single('image'), async (req, res) => {
    try {
      const cloudinaryResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            console.error(error);
            reject('Failed to upload image to Cloudinary');
          } else {
            console.log(result);
            resolve(result);
          }
        }).end(req.file.buffer);
      });
      res.json({ imageUrl: cloudinaryResult.secure_url });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message });
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


module.exports =app