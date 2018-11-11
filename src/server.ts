import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import ScoresRepository from "./scoresRepository";

const app = express();
const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const scoresRepository : ScoresRepository = new ScoresRepository();

const corsOptions = {
  origin: clientUrl
}

app.use(bodyParser.json());

app.get("/api/status", (request, response) => {
  response.json({ status: "Most Excellent" });
});

app.get("/api/scoreData", cors(corsOptions), (request, response) => {
  scoresRepository
    .scores()
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

app.post("/api/scoreData", cors(corsOptions), (request, response) => {
  scoresRepository
    .putScore(request.body)
    .then(result => {
      return response.json({ data: result.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
})

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
