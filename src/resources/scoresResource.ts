import cors from "cors";
import express, { Router } from "express";
import ScoresRepository from "../repositories/scoresRepository";
import { loginRequired } from '../auth/utils';
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

// TODO: Refactor all these to use DI
const scoreRepository: ScoresRepository = new ScoresRepository();

router.get(
  "/group/:groupId/game/:gameId",
  cors(corsOptions),
  loginRequired,
  (request, response) => {
    scoreRepository
      .scores(request.params.groupId, request.params.gameId)
      .then(scores => {
        return response.json({ data: scores.rows });
      })
      .catch(error => {
        console.log(error);
        return response.json(error);
      });
  }
);

export default router;
