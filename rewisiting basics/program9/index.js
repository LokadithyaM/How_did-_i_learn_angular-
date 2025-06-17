const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());

mongoose.connect(process.env.MONGODB,{
}).then(()=>{
    console.log('Connected to MongoDb');
}).catch((err)=>{
    console.error('Error Connecting to MonogDb',err);
});

const userSchema = new mongoose.Schema({
    email:{type:String, require:true, unique:true},
    password:{type:String, require: true},
});

const User = mongoose.model("User", userSchema);

app.post('/register', async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send("email and password are required");
    try{
        const existinguser = await User.findOne({email});
        if(existinguser) return res.status(400).send("user already exists");
        const hashedPassword = await bycrypt.hash(password, 10);
        const user = new User({email,password: hashedPassword});
        await user.save();
        return res.status(201).send("user registerd succesfully");
    }catch(err){
        console.error("error registering user", err);
    }
});

app.post('/login', async (req,res)=>{
    const {email, password} = req.body;
    if(!email || ! password) return res.status(400).send("email and password are required");
    try{
        const user = await User.findOne({email});
        if(!user) return res.status(400).send("user not found");
        const isMatch = await bycrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).send("invalid credentials");

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        return res.status(200).json({token});
    }catch (err){
        console.error(err);
    }
});

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
});



