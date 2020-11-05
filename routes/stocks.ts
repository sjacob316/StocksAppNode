import express from 'express';

const router = express.Router();
const axios = require("axios").default

router.get("/", (req, res) => axios.get(`https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=AAPL&apikey=${process.env.ALPHAVANTAGE_APIKEY}`).then((response) => {
    res.json(response.data);    
}))

module.exports = router;