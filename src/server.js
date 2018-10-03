import express from "express";

const app = express();
const port = process.env.port || 3001;

var data = {
    "data": {
      "user": {
        "name": "Foo",
        "wins": 5
      },
      "user": {
        "name": "Roo",
        "wins": 2
      }
    }
  };

app.get("/api/status", (request, response) => {
  response.json({ status: "Most Excellent" });
});

app.get("/api/scoreData", (request, response) => {
  response.json(data);
});

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;