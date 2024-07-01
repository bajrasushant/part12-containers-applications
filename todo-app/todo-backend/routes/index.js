const redis = require("../redis");
const express = require("express");
const router = express.Router();

const configs = require("../util/config");

let visits = 0;

/* GET index data. */
router.get("/", async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits,
  });
});

router.get("/statistics", async (req, res) => {
  let todo_count = await redis.getAsync("added_todos");
  if(!todo_count) { todo_count = 0 }
  res.send({
    added_todos: parseInt(todo_count),
  });
});

module.exports = router;
