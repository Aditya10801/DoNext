const Task = require('../models/task');

const getAuthKey = (req) => req.headers['x-flux-key'];

exports.getTasks = async (req, res) => {
  const userKey = getAuthKey(req);
  if (!userKey) return res.status(401).json({ success: false, error: 'Missing x-flux-key header' });
  try {
    const tasks = await Task.find({ userKey }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, tasks });
  } catch (err) {
    console.error('getTasks error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createTask = async (req, res) => {
  const userKey = getAuthKey(req);
  if (!userKey) return res.status(401).json({ success: false, error: 'Missing x-flux-key header' });
  try {
    const task = await Task.create({ ...req.body, userKey });
    res.status(201).json({ success: true, task });
  } catch (err) {
    console.error('createTask error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  const userKey = getAuthKey(req);
  if (!userKey) return res.status(401).json({ success: false, error: 'Missing x-flux-key header' });
  const { duration } = req.body;
  try {
    if (duration <= 2) {
      await Task.findOneAndDelete({ _id: req.params.id, userKey });
      return res.status(200).json({ success: true, message: 'Finalized' });
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userKey },
      { duration, isPartial: true },
      { new: true }
    );
    if (!task) return res.status(403).json({ success: false, message: 'Unauthorized' });
    res.status(200).json({ success: true, task });
  } catch (err) {
    console.error('updateTask error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  const userKey = getAuthKey(req);
  if (!userKey) return res.status(401).json({ success: false, error: 'Missing x-flux-key header' });
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userKey });
    if (!task) return res.status(403).json({ success: false, message: 'Unauthorized' });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('deleteTask error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};