const express = require("express");
const router = express.Router();
const { createTask, getTasks, deleteTask, updateTask } = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.patch("/:id", updateTask);

module.exports = router;