const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },

    // tokens will be the array of objects as there will be new token generated everytime the user logs in...
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
});


// we are now using a kind of middleware to hash the password. So this 'pre' method will be called before 'save' method anywhere in the code. and it will work as a middleware. If the user modify their 'password' field only (not the other fields), then this 'pre' method will be called...

userSchema.pre('save', async function(next) {
    console.log("Hello i'm the middleware...!!");
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});



// we are generating token
userSchema.methods.generateAuthToken = async function(){
    try{
        let newToken = jwt.sign({
            _id : this._id
        }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token : newToken });
        await this.save();
        return newToken;
    }
    catch(error){
        console.log(error);
    }
}


// here User/User is the a single document for a paticular user and users is the collection of these multiple documents
const User = mongoose.model("USER", userSchema);

module.exports = User;