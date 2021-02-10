import express from 'express'
import csrf from 'csurf'
import session from "express-session";
import passport from 'passport';
import passportLocal from 'passport-local';
const bodyParser = require('body-parser');
const app = express();
const port = 4000;
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');
// const csrfProtection = csrf({
//     cookie: true
// });


require('dotenv').config();
// app.use(
//     jwt({
//       secret: process.env.JWT_SECRET,
//       getToken: req => req.cookies.token,
//       algorithms: ['HS256'] 
//     })
//   );
// app.use(jwt({ secret: process.env.JWT_SECRET,}));
// app.use(csrfProtection);
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use((req, res, next) => {
//     res.header({"Access-Control-Allow-Origin": "*"})
//   }) 
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/auth', require('./routes/authentication'));



// app.use(
//     jwt({
//       secret: process.env.JWT_SECRET,
//       getToken: req => req.cookies.token,
//         algorithms: ['HS256'] 
//     })
//   );

//   app.post("/verify-token" , (req, res) => {
//       console.log(req);
//     let value = jwt.verify(req.cookies.token)
//     return res.json(value);
// })


app.listen(port, () => {
    console.log(`App listeing at http://localhost:${port}`);
})

// app.get('/csrf-token', (req, res) => {
//     res.json({ csrfToken: req.csrfToken() });
// })

app.use(express.json())
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user);
})

passport.deserializeUser((user, done) => {
  return done(null, user);
})

// const passport = require('passport');
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

app.get('/auth/google', 
passport.authenticate('google', { scope: ['profile']}));

app.get('/auth/google/callback', 
  passport.authenticate( 'google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:3000/');
  })

app.get('/getuser', (req, res) => {
  res.send(req.user);
})


mongoose.connect(
    process.env.MONGOOSE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    () => console.log('connected to DB!')
)

// https://medium.com/@ryanchenkie_40935/react-authentication-how-to-store-jwt-in-a-cookie-346519310e81