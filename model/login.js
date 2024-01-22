const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://bloomingbuds245:bloomingbuds@cluster0.h4nmndz.mongodb.net/test?retryWrites=true&w=majority",
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{console.log("DB connected")
})
.catch(err=>console.log(err));

const loginSchema = new mongoose.Schema({
    username : String,
    password : String,
});

const loginModel = mongoose.model('login',loginSchema);

module.exports = loginModel;