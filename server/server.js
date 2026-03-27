const express = require('express');
const cors = require('cors');
const z = require ('zod');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const dbURL = process.env.DB;

const connectDB = require('./config/db');
connectDB();

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});