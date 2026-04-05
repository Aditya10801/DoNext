const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: Number, required: true }, 
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isChippable: { type: Boolean, default: false }, // New Flag
    isPartial: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);