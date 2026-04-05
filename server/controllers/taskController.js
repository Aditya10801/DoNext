const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const { title, duration, priority, isChippable } = req.body;
        const task = await Task.create({ title, duration, priority, isChippable });
        res.status(201).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { duration } = req.body;
    try {
        if (duration <= 2) {
            await Task.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: "Task Finalized" });
        }
        const task = await Task.findByIdAndUpdate(id, { duration, isPartial: true }, { new: true });
        res.status(200).json({ success: true, task });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};