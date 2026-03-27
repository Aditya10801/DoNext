const Task = require('../models/task.js');

exports.createTask = async (req,res)=>{
    try{
        const {title,duration,priority,effort}=req.body;
        const task = await Task.create({
            title,duration,priority,effort
        });
        res.status(201).json({
            success : true,
            message : "Task Created Successfully",
            task
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Failed to Create Task",
            error : err.message
        })
    }
}

exports.getTasks = async (req,res)=>{
    try{
        const tasks = await Task.find();
        res.status(200).json({
            success : true,
            message : "Task Fetched Successfully",
            tasks
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Failed to Fetch Task",
            error : err.message 
        })
    }
}

exports.deleteTask = async(req,res)=>{
    const taskID = req.params.id;
    try{
        const task = await Task.findByIdAndDelete(taskID);
        if(!task){
            return res.status(404).json({
                success : false,
                message: "Task Not Found"
            })
        }
        res.status(200).json({
            success : true,
            message : "Task Deleted Successfully"
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : "Failed to Delete Task",
            error : err.message
        })
    }
}