const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.DB;

const connectDB = async()=>{
    try{
        await mongoose.connect(dbURL) ;
        console.log('Connected To DB');
    
    }catch(err){
        console.log(err);
    }
}

module.exports = connectDB;
