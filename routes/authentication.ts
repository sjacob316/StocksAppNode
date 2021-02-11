import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
const router = express.Router();
const axios = require("axios").default
const User = require("../models/Users");
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser((user, done) => {
    return done(null, user);
  })
  
  passport.deserializeUser((user, done) => {
    return done(null, user);
  })

  passport.use(new LocalStrategy((username, password, done) => {
      User.findOne({username: username}, (err, user: any) => {
          if (err) throw err;
          if(!user) return done(null, false);
          bcrypt.compare(password, user.password, (err, result) => {
              if(err) throw err;
              if(result === true) {
                  return done(null, user);                  
              } else {
                  return done(null, false);
              }
          })
      })
  }))
  
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
      clientID: "445355911190-15pti9bl81t1qb08d876m0vn72qsls3m.apps.googleusercontent.com",
      clientSecret: "5KyDcGaX39F5133ruLkcPZzE",
      callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile)
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      cb(null, profile);
    }
  ));

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
        res.cookie('token', token, { maxAge: 60000, httpOnly: true });
        return res.json({ token})
    }
    res.json({ status: 'error', error: 'Invalid username/password'})
})

// router.post("/verify/", async (req, res) => {
//     const { token } = req.params;
//     console.log(req.headers.cookie);
//     const returnValue = jsonwebtoken.verify(req.headers.cookie.substring(6), process.env.JWT_SECRET);
//     return res.json(returnValue);
// })

router.post("/logout/", async (req, res) => {
    res.cookie('token', 'none', { maxAge: 0, httpOnly: true})
    return res.json({message: "User logged out succesfully"})
})

router.get('/google', 
passport.authenticate('google', { scope: ['profile']}));

router.get('/google/callback', 
  passport.authenticate( 'google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:3000/');
  })

  router.get('/getuser', (req, res) => {
  res.send(req.user);
})
// const passport = require('passport');

// router.get("/google", passport.authenticate("google", {
//     scope: ['profile']
// }));

// router.get("/google/redirect", (req, res) => {
//     console.log("here")
//     res.json({data: "success"})
// })
module.exports = router; 