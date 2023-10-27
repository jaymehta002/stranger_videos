require('dotenv').config();
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const routes = require('./routes/routes');
const app = express();
const port = 3000 || process.env.PORT;

// Serve the static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Ensure the 'uploads' directory exists
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Connect to MongoDB
connectDB();

// Set up multer storage for video uploads
// ...

// Use the routes
app.use('/', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
