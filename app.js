const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// express server app creation
const app = express();

// config for .env file
dotenv.config({ path : './config.env' });
const PORT = process.env.PORT;

require('./db/conn');

// getting the user schema 'USER'
// const User = require('./model/userSchema');


// This following middleware confirms that the application is able to to parse json data
app.use(express.json());

// path for router file
app.use(require('./router/auth'));


app.listen(`${PORT}`, () => {
    console.log(`Server is running on port ${PORT}`);
})