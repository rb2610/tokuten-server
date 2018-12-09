import cors from "cors";
import express, { Router } from "express";
import ScoresRepository from "../repositories/scoresRepository";

const router: Router = express.Router();

const scoreRepository: ScoresRepository = new ScoresRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

router.get("/group/:groupId/game/:gameId", cors(corsOptions), (request, response) => {
  scoreRepository
    .scores(request.params.groupId, request.params.gameId)
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default router;