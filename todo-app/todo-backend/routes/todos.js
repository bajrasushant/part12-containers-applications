const express = require("express");
const { Todo } = require("../mongo");
const { setAsync, getAsync } = require("../redis");
const router = express.Router();

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  const todosCount = await getAsync("added_todos");
  await setAsync("added_todos", todosCount ? parseInt(todosCount) + 1 : 1);
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const updateFields = {
    ...(req.body.text && { text: req.body.text }),
    ...(req.body.done !== undefined && { done: req.body.done }),
  };
  const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, updateFields, {
    new: true,
  });
  res.send(updatedTodo);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
