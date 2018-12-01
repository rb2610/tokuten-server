import cors from "cors";
import express, { Router } from "express";
import PlayerRepository from "../repositories/playerRepository";

const router: Router = express.Router();

const playerRepository: PlayerRepository = new PlayerRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

router.options("/", cors(corsOptions));

router.post("/", cors(corsOptions), (request, response) => {
  playerRepository
    .addPlayer(request.body, request.query.groupId, request.query.gameId)
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default router;