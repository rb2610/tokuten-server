import cors from "cors";
import express, { Router } from "express";
import GroupRepository from "../repositories/groupRepository";
import { loginRequired } from "../auth/utils";
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

const groupRepository: GroupRepository = new GroupRepository();

router.options("/", cors(corsOptions));

router.get("/", cors(corsOptions), loginRequired, (request, response) => {
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

router.post("/", cors(corsOptions), loginRequired, (request, response) => {
  groupRepository
    .addGroup(request.body)
    .then(groups => {
      return response.json({ data: groups.rows });
    })
    .catch(error => {
      console.log(error);
      return response.json(error);
    });
});

export default router;