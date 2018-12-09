import bodyParser from "body-parser";
import express from "express";
import gameResource from "./resources/gameResource";
import groupResource from "./resources/groupResource";
import playerResource from "./resources/playerResource";
import roundResource from "./resources/roundResource";
import scoresResource from "./resources/scoresResource";

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

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
