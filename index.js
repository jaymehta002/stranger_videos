const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');
const authRoute = require('./routes/authRoute');
const videoRoute = require('./routes/videoRoute');
const connectDB = require('./config/db');
require('dotenv').config({ path: './config/.env' });
connectDB();

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Set up session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);

app.use('/', authRoute);
app.use('/', videoRoute);

// Server setup
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
