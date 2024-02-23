const locationModel = require("../model/location");
const app = require('express').Router();

app.post('/location', (request, response) => {
    new locationModel(request.body).save()
    response.send("Success")
})

module.exports =app