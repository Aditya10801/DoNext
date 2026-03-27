const mongoose = require('mongoose');  

const taskSchema = new mongoose.Schema ({
    title : {
        type : String,
        required : true
    },
    duration : {
        type : Number , 
        required : true
    },
    priority:{
        type : String, 
        enum : [ "low", "medium" ,"high"],
        required: true,
        default:"medium"
    },
    effort:{
        type : String, 
        enum : [ "low", "medium" ,"high"],
        required: true,
        default:"medium"
    },
    createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Task', taskSchema);