import cors from "cors";
import express, { Router } from "express";
import RoundRepository from "../repositories/roundRepository";

const router: Router = express.Router();

const roundRepository: RoundRepository = new RoundRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

router.options("/", cors(corsOptions));

router.post("/", cors(corsOptions), (request, response) => {
  roundRepository
    .addRound(request.query.groupId, request.query.gameId, request.body.participants)
    .then(scores => {
      return response.json({ "data": scores.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default router;