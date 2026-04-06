const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    duration: { type: Number, required: true },
    originalDuration: { type: Number }, // set on first save, never changed
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    isChippable: { type: Boolean, default: false },
    isPartial: { type: Boolean, default: false },
    userKey: { type: String, required: true, index: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);