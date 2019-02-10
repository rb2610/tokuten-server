import cors from "cors";
import express, { Router } from "express";
import GameRepository from "../repositories/gameRepository";
import { loginRequired } from "../auth/utils";
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

const gameRepository: GameRepository = new GameRepository();

router.options("/", cors(corsOptions));

router.get("/", cors(corsOptions), loginRequired, (request, response) => {
  gameRepository
    .games()
    .then(scores => {
      return response.json({ data: scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

router.post("/", cors(corsOptions), loginRequired, (request, response) => {
  gameRepository
    .addGame(request.body)
    .then(scores => {
      return response.json({ data: scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

export default router;