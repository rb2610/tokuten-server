import cors from "cors";
import express, { Router } from "express";
import passport = require("passport");
import { loginRequired } from "../auth/utils";
import { corsOptions } from "../util/constants";

const router: Router = express.Router();

router.options("/login", cors(corsOptions));

router.post(
  "/login",
  cors(corsOptions),
  passport.authenticate("local"),
  (request, response) => {
    let user = request.user;

    if (!user) {
      return response.status(404).json({ message: "User Not Found" });
    }

    return request.logIn(user, error => {
      if (error) {
        response.status(500).json({ message: "Login Failed" });
      }
      response.status(200).json({ message: "Success", user: user });
    });
  }
);

router.options("/logout", cors(corsOptions));

router.get("/logout", cors(corsOptions), loginRequired, (request, response) => {
  request.logout();
  response.status(200).json({ message: "Success" });
});

export default router;
