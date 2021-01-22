import express from 'express'
import csrf from 'csurf'

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
app.use(cors());
app.use('/api/stocks', require('./routes/stocks'));
app.use('/api/auth', require('./routes/authentication'));

app.use(cookieParser());

app.listen(port, () => {
    console.log(`App listeing at http://localhost:${port}`);
})

// app.get('/csrf-token', (req, res) => {
//     res.json({ csrfToken: req.csrfToken() });
// })

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