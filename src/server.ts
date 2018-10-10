import express from "express";
import ScoresRepository from "./scoresRepository";

const app = express();
const port = process.env.port || 3001;

const scoresRepository : ScoresRepository = new ScoresRepository();

app.get("/api/status", (request, response) => {
  response.json({ status: "Most Excellent" });
});

app.get("/api/scoreData", (request, response) => {
  response.json(scoresRepository.scores());
});

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;