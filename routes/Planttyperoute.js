const plantmodel = require('../model/planttype')
const app = require('express').Router()

app.post('/ptnew', (request, response) => {
    new plantmodel(request.body).save()
    response.send("Success")
})

app.get('/admin/ptview', async (request, response) => {
    var data = await plantmodel.find();
    response.send(data)
})

app.get('/ptview', async (request, response) => {
    var data = await plantmodel.find({ Status: "ACTIVE" });
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
        const existingPlant = await plantmodel.findById(id);
        await plantmodel.findOneAndUpdate({ _id: id }, { $set: updatedData });
        if (!existingPlant) {
            return response.status(404).json({ message: "Plant not found" });
        }
        await plantmodel.findByIdAndUpdate(id, { $set: updatedData });
        response.json({ message: "Record Updated" });
    } catch (error) {
        console.error("Error updating plant details:", error);
        response.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports =app