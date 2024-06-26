// app.js
const express = require('express');
const routes = require('./src/routes');
const connectDB = require('./src/config/db'); 
const dotenv = require('dotenv');
const multer = require('multer');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());






dotenv.config();


// Connect to the database
connectDB()
// Use the user routes
app.use('/', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});