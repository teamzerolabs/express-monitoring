const metric = require("./metric/setup");
const express = require("express");
const app = express();

metric.insertMiddleware(app, { normalizePath: false });

app.get("/api", (req, res, next) => {
  res.status(200).send("Api Works.");
});
app.get("/api/fast", (req, res, next) => {
  res.status(200).send("Fast response!");
});
app.get("/api/slow", (req, res, next) => {
  setTimeout(() => {
    res.status(200).send("Slow response...");
  }, 1000);
});
app.get("/api/error", (req, res, next) => {
  try {
    throw new Error("Something broke...");
  } catch (error) {
    res.status(500).send(error);
  }
});
app.get("/api/list/:listId", (req, res, next) => {
  res.status(200).send(`Retrieved list ${req.params.listId}`);
});

app.listen(4000, () => console.log("Server is running on port 4000"));

metric.captureAllRoutes(app);
metric.setupMetricService();
