import { profile } from 'console';
import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
const router = express.Router();
const axios = require("axios").default
const userInfo  = require("../models/Users");
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
    userInfo.findOne({username: username}, (err, user: any) => {
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
    function(accessToken, refreshToken, profile: any, cb) {
        console.log(profile)
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      userInfo.findOne({
          provider: "google",
          providerUserId: profile.id
      }, (err, user) => {
          if(err) {
              console.log(err);
          }
          if(!user) {
              userInfo.create({
                  provider: "google",
                  providerUserId: profile.id,
                  email: profile.emails[0].value,     
                  firstName: profile.name.givenName,
                  lastName: profile.name.familyName,             
              })
          }
      })      
      cb(null, profile);
    }
  ));

  router.get("/logout/", (req, res) => {
    //   req.session.destroy(() => {
        req.session = null;
        req.logout();
    //   })      
      res.send(req.user);
    //   res.redirect("http://localhost:3000//login/")
  })

router.post("/register-user/", async (req, res) => {        
    const { firstName, lastName, email } = req.body;
    const password = await bcrypt.hash(req.body.password, 10);
    console.log(password);
    console.log(password);
    try {
        await userInfo.findOne({
            provider: "local",          
            providerUserId: email
        }, (err, user) => {
            if(err) {
                console.log(err);
            }
            if(!user) {            
                userInfo.create({
                    provider: "local",
                    providerUserId: email,
                    password,
                    firstName,
                    lastName,
                    email
                })
            }
            else {
                console.log("found a user")
            }            
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
    const memberInfo = await userInfo.findOne({ provider: "local", providerUserId: email }).lean()
    if(!memberInfo) {
        return res.json({ status: 'error', error: 'Invalid username/password'})
    }
    if(await bcrypt.compare(password, memberInfo.password)) {
        console.log(memberInfo);
        await userInfo.findOne({ id: memberInfo._id})
        const token = jsonwebtoken.sign( {id: memberInfo._id, email: memberInfo.email}, process.env.JWT_SECRET, {expiresIn: '1h'} )
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

// router.post("/logout/", async (req, res) => {
//     res.cookie('token', 'none', { maxAge: 0, httpOnly: true})
//     return res.json({message: "User logged out succesfully"})
// })

router.get('/google', 
passport.authenticate('google', { scope: ['profile', 'email']}));

router.get('/google/callback', 
  passport.authenticate( 'google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:3000/');
  })

  router.get('/getuser', (req, res) => {
      console.log(req.user)
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