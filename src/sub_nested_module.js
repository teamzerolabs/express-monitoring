const express = require("express");

const router = express.Router();

router.get("/:id2", (req, res, next) => {
  res.json({
    result: `It's me! ${req.params.id} and ${req.params.id2}`
  });
});

module.exports = router;
