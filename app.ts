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
// const cookieParser = require("cookie-parser");
const jwt = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');


require('dotenv').config();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.listen(port, () => {
    console.log(`App listeing at http://localhost:${port}`);
})

app.use(express.json())
app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
  })
);
// app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/stocks', require('./routes/stocks'));
app.use('/auth', require('./routes/authentication'));


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