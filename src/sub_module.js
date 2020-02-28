const express = require("express");

const router = express.Router();

router.get("/:id", (req, res, next) => {
  res.json({
    result: `It's me! ${req.params.id}`
  });
});

router.use("/:id/more", require("./sub_nested_module"));

module.exports = router;
