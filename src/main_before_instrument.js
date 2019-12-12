const express = require("express");
const app = express();

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
app.get("/api/list/:listId", (req, res, next) => {
  res.status(200).send(`Retrieved list ${req.params.listId}`);
});

app.listen(4000, () => console.log("Server is running on port 4000"));
