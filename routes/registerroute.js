const registerModel = require('../model/register')
const app = require('express').Router()

//Login
app.post('/login', (req, res) => {
    const {email, password} = req.body;
    registerModel.findOne({email: email})
    .then(userr => {
        if(userr) {
            if(userr.password === password) {
                res.json("Success")
            } else {
                res.json("the password is incorrect")
            }
        } else {
            res.json("No record existed")
        }
    })
})


//Register
app.post('/register', (req, res) => {
   registerModel.create(req.body)
   .then(register => res.json(register))
   .catch(err => res.json(err))
})
  