const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB)
    .then(() => {
        console.log("MongoDB connected successfully...!!!");
    })
    .catch((error) => {
        console.log(error);
    })