import express from 'express'

const app = express();
const port = 4000;

app.use('/api/stocks', require('./routes/stocks'));

app.listen(port, () => {
    console.log(`App listeing at http://localhost:${port}`);
})