import express from "express";

const app = express();
const port = process.env.port || 3001;

app.get('/api/hello', (request, response) => {
    response.send({ 'message': 'MANGOES (は美味しいよ)' });
});

app.listen(port, () => console.log(`Listening on port ${port}`));