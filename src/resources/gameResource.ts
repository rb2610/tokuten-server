import cors from "cors";
import express, { Router } from "express";
import GameRepository from "../repositories/gameRepository";

const router: Router = express.Router();

const gameRepository: GameRepository = new GameRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

router.options("/", cors(corsOptions));

router.get("/", cors(corsOptions), (request, response) => {
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

router.post("/", cors(corsOptions), (request, response) => {
  gameRepository
    .addGame(request.body)
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default router;