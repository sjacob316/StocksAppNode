import express from 'express';

const router = express.Router();
const axios = require("axios").default
const User = require("../models/Users");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');


router.post("/register-user/", async (req, res) => {    
    // await User.create({email: req.params.email, password: req.params.password })
    const { firstName, lastName, email } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    console.log(password);
    console.log(password);
    try {
        await User.create({
            firstName,
            lastName,
            email,
            password
        })
    } catch(error) {
        if(error.code === 11000) {
            return res.json({ status: 'error', error: 'Email already in use'})
        }     
        throw error   
    }
    res.json({ status: 'ok'})
})

router.post("/login/", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean()
    if(!user) {
        return res.json({ status: 'error', error: 'Invalid username/password'})
    }
    if(await bcrypt.compare(password, user.password)) {
        const token = jsonwebtoken.sign( {id: user._id, email: user.email}, process.env.JWT_SECRET, {expiresIn: '1h'} )
        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        return res.json({ token})
    }
    res.json({ status: 'error', error: 'Invalid username/password'})
})

router.post("/logout/", async (req, res) => {
    res.cookie('token', 'none', { maxAge: 0, httpOnly: true})
    return res.json({message: "User logged out succesfully"})
})

module.exports = router; 