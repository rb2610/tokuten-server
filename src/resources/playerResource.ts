import cors from "cors";
import express, { Router } from "express";
import PlayerRepository from "../repositories/playerRepository";
import { loginRequired } from "../auth/utils";
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

const playerRepository: PlayerRepository = new PlayerRepository();

router.options("/", cors(corsOptions));

router.post("/", cors(corsOptions), loginRequired, (request, response) => {
  playerRepository
    .addPlayer(request.body, request.query.groupId)
    .then(scores => {
      return response.json({ data: scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

export default router;