import cors from "cors";
import express, { Router } from "express";
import GroupRepository from "../repositories/groupRepository";

const router: Router = express.Router();

const groupRepository: GroupRepository = new GroupRepository();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

const corsOptions = {
  origin: clientUrl
};

router.options("/", cors(corsOptions));

router.get("/", cors(corsOptions), (request, response) => {
  groupRepository
    .groups()
    .then(groups => {
      return response.json({ data: groups.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

router.post("/", cors(corsOptions), (request, response) => {
  groupRepository
    .addGroup(request.body)
    .then(groups => {
      return response.json({ "data": groups.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error)
    });
});

export default router;