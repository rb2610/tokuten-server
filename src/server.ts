import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import gameResource from "./resources/gameResource";
import groupResource from "./resources/groupResource";
import scoreTableResource from "./resources/scoreTableResource";
import playerResource from "./resources/playerResource";
import ScoresRepository from "./scoresRepository";

const app = express();
const port = process.env.PORT || 3001;
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
}

const scoresRepository : ScoresRepository = new ScoresRepository();

app.use(bodyParser.json());

app.use("/game", gameResource);
app.use("/group", groupResource);
app.use("/scoreTable", scoreTableResource);
app.use("/player", playerResource);

app.get("/api/status", (request, response) => {
  response.json({ status: "Most Excellent" });
});

app.options("/api/scoreData", cors(corsOptions));

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
    .addPlayer(request.body)
    .then(result => {
      return response.json({ data: result.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

app.put("/api/scoreData/:id", cors(corsOptions), (request, response) => {
  scoresRepository
    .updatePlayerScore(request.params.id, request.body)
    .then(result => {
      return response.json({ data: result.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
