const mongoose = require('mongoose')


//iNoteBook this last word of endpoint will create a folder of iNotewbook in your mongodb server 
const mongooseURI = "mongodb://127.0.0.1:27017/mechanic?"

const MongooseConnect = async ()=>{
     await mongoose.connect(mongooseURI).then(()=>{
        console.log("Connected to Mongo Succesfully")
     })
}



module.exports = MongooseConnect