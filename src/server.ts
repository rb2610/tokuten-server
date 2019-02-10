import bodyParser from "body-parser";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "pg";
import authResource from "./resources/authResource";
import gameResource from "./resources/gameResource";
import groupResource from "./resources/groupResource";
import playerResource from "./resources/playerResource";
import roundResource from "./resources/roundResource";
import scoresResource from "./resources/scoresResource";
import passport from "passport";
import passportInit from "./auth/passport";

const pgSession = connectPgSimple(session);

const app = express();
const port = process.env.PORT || 3001;
const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const isSecure = process.env.NODE_ENV !== "dev"

passportInit();

app.use(bodyParser.json());
app.use(
  session({
    store: new pgSession({
      pool: new Pool()
    }),
    secret: "A Secret Secret", // TODO: Use env vars
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: THIRTY_DAYS_IN_MS,
      httpOnly: true,
      secure: isSecure
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authResource);
app.use("/games", gameResource);
app.use("/groups", groupResource);
app.use("/players", playerResource);
app.use("/rounds", roundResource);
app.use("/scores", scoresResource);

app.get("/status", (request, response) => {
  response.json({ status: "Most Excellent" });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
