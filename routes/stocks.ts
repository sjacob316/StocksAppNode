import express from 'express';

const router = express.Router();
const axios = require("axios").default

router.get("/symbol-search/:keywords", (req, res) => axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${req.params.keywords}&apikey=${process.env.ALPHAVANTAGE_APIKEY}`).then((response) => {    
    res.json(response.data);    
}))

router.get("/overview/:symbol", (req, res) => axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${req.params.symbol}&apikey=${process.env.ALPHAVANTAGE_APIKEY}`).then((response) => {    
    res.json(response.data);    
}))

router.get("/time-series/:symbol", (req, res) => axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.symbol}&interval=5min&apikey=${process.env.ALPHAVANTAGE_APIKEY}`).then((response) => {                                                               
    const arrayOfObj = Object.entries(response.data["Time Series (5min)"]).map((e: any) => ({
        "volume": e[1]["5. volume"].replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        "y": e[1]["1. open"], 
        "date": e[0]
    }));  
    arrayOfObj.reverse();
    res.json(arrayOfObj);    
}))

router.get("/income/:symbol", (req, res) => axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.params.symbol}&token=${process.env.FINNHUB_APIKEY}`).then((response) => {    
    res.json(response.data);    
}))

router.get("/peers/:symbol", (req, res) => axios.get(`https://finnhub.io/api/v1/stock/peers?symbol=${req.params.symbol}&token=${process.env.FINNHUB_APIKEY}`).then((response) => {    
    res.json(response.data);    
}))

router.get("/quote/:symbol", (req, res) => axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.params.symbol}&token=${process.env.FINNHUB_APIKEY}`).then((response) => {
    res.json(response.data);
}))

router.get("/general-news/", (req, res) => axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_APIKEY}`).then((response) => {
    let news = response.data.map(gNews => ({
        category: gNews.category,
        datetime: new Date(gNews.datetime * 1000),
        headline: gNews.headline,
        image: gNews.image,
        source: gNews.source,
        summary: gNews.summary,
        url: gNews.url
    }))

    news = news.slice(0, 10)
    res.json(news);
}))

router.get("/upcoming-earnings/", (req, res) => axios.get(`https://finnhub.io/api/v1/calendar/earnings?from=2020-07-12&to=2020-12-07&token=${process.env.FINNHUB_APIKEY}`).then((response) => {
    res.json(response.data);
}))

router.get("/company-news/:symbol/:startDate/:endDate", (req, res) => axios.get(`https://finnhub.io/api/v1/company-news?symbol=${req.params.symbol}&from=${req.params.startDate}&to=${req.params.endDate}&token=${process.env.FINNHUB_APIKEY}`).then((response) => {
    let news = response.data.map((cNews => ({
        category: cNews.category,
        datetime: new Date(cNews.datetime * 1000),
        headline: cNews.headline,
        image: cNews.image,
        source: cNews.source,
        summary: cNews.summary,
        url: cNews.url
    })))
    
    if(news.length > 10) {
        news = news.slice(0, 10);
    }
    res.json(news);
}))

router.get("/company-earnings/:symbol", (req, res) => axios.get(`https://finnhub.io/api/v1/calendar/earnings?from=2020-01-12&to=2020-12-07&symbol=${req.params.symbol}&token=${process.env.FINNHUB_APIKEY}`).then((response) => {
    res.json(response.data);
}))

router.get("/news-sentiment")

module.exports = router; 