import cors from "cors";
import express, { Router } from "express";
import ScoreTableRepository from "../repositories/scoreTableRepository";

const scoreData: Router = express.Router();

const scoreTableRepository: ScoreTableRepository = new ScoreTableRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

scoreData.get("/group/:groupId/game/:gameId", cors(corsOptions), (request, response) => {
  scoreTableRepository
    .scores(request.params.groupId, request.params.gameId)
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default scoreData;