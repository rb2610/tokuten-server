import cors from "cors";
import express, { Router } from "express";
import RoundRepository from "../repositories/roundRepository";
import { loginRequired } from "../auth/utils";
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

const roundRepository: RoundRepository = new RoundRepository();

router.options("/", cors(corsOptions));

router.post("/", cors(corsOptions), loginRequired, (request, response) => {
  roundRepository
    .addRound(
      request.query.groupId,
      request.query.gameId,
      request.body.participants
    )
    .then(scores => {
      return response.json({ data: scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

export default router;
