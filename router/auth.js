const express = require('express');
const router = express.Router();
require('../db/conn');
const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');
const jst = require('jsonwebtoken');

// Middleware...
const middleware = (req, res, next) => {
    next();
}

router.get('/', (req, res) => {
    res.send("This is Home page and connecting from auth.js");
});

router.get('/help', (req, res) => {
    res.cookie("HelpCookie", "Happy to help you");
    res.send("This is help page...!!");
});

// Saving data Using Promises...

// router.post('/register', (req, res) => {

//     const {name, email, age, location, phone, password }= req.body;

//     if(!name || !email || !age || !location || !phone || !password)
//     {
//         return res.status(422).json({ error : "Please provide details"});
//     }

//     User.findOne({ email : email })
//         .then((userExists) => {

//             // If the user already exists in the database
//             if(userExists){
//                 return res.status(422).json({ error : "User already exists. Try different Email"});
//             }

//             // If the user is new...
//             const user = new User({name, email, age, location, phone, password});

//             // saving the user is also a asynchronous function...
//             user.save()
//                 // this is success hence status code 200
//                 .then(() => {
//                     res.status(200).json({ message : "User Registered Successfully...!!" });
//                 })
//                 // this is database error, hence status code 500
//                 .catch((error) => {
//                     res.status(500).json({ message : "Failed to register...!! Please try again later." })
//                 })
//         })
//         .catch((error) => {
//             console.log(error);
//         })
// });
// -------------------------------------------------------------------------

// Saving data Using async-await......


router.get('/', (req, res) => {
    res.send("This is Home page and connecting from auth.js");
});

router.post('/register', async (req, res) => {

    const {name, email, age, location, phone, password }= req.body;

    if(!name || !email || !age || !location || !phone || !password)
    {
        return res.status(422).json({ error : "Please provide details"});
    }

    try{
        const userExists = await User.findOne({ email : email })

        if(userExists){
            return res.status(422).json({ error : "User already exists. Try different Email"});
        }

        // If the user is new...
        const user = new User({name, email, age, location, phone, password});

        // hash the password here just before saving it to database...


        const userRegistration = await user.save();

        if(userRegistration){
        
            // console.log(`${name} user Registered successfully`);
            // console.log(userRegistration);

            res.status(200).json({ message : "User Registered Successfully...!!" });
        }
        else{
            res.status(500).json({ message : "Failed to register...!! Please try again later." })
        }
    }
    catch(error){
        console.log(error);
    }

});

// ----------------------USER LOGIN VALIDATION----------------------------------

router.post('/login', async (req, res) => {
    
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error : "Please enter all the fields" });
    }

    try{
        const userInfo = await User.findOne({ email : email });

        // if the email doesnot match any email in database, so response will be null. Hence we need to handle that. !response means - if we don't get any response.
        if(!userInfo){
            return res.status(500).json({
                error : "Invalid credentials...!!"
            });
        }

        // now we will compare the saved password in database with the user entered password using bcrypt.compare()
        const isMatched = await bcrypt.compare(password, userInfo.password);

        if(isMatched){

            // now generate the json web token
            const token = await userInfo.generateAuthToken();
            console.log(token);

            // token is saved in cookie and expires in 2 minutes(120000 milliseconds)
            res.cookie("jwtoken", token, {
                expires : new Date(Date.now() + 120000),
                httpOnly : true
            });

            return res.status(200).json({
                message : "Logged in successfully"
            });
        }
        res.status(500).json({
            error : "Invalid credentials...!!"
        });
    }
    catch(error){
        console.log(error);
    }
});

module.exports = router;
