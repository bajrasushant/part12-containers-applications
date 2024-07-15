const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", {
    name: 1,
    username: 1,
    id: 1,
  });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  if (
    body.title === undefined ||
    body.url === undefined ||
    body.title === "" ||
    body.url === ""
  ) {
    response.status(400).send({ error: "Bad Request" });
  } else {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "invalid token" });
    }
    const user = request.user;

    const blog = new Blog({ ...body, user: user.id });

    const result = await blog.save();
    user.blogs = user.blogs.concat(blog._id);
    await user.save();
    response.status(201).json(result);
  }
});

blogRouter.post("/:id/comments", async (request, response) => {
  const { id } = request.params;
  const { comment } = request.body;
  if (!comment) {
    return response.status(500).send({ error: "Unable to add comment" });
  }
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).send({ error: "Blog post not found" });
    }
    blog.comments.push(comment);

    await blog.save();
    response.status(204).end();
  } catch (err) {
    console.error("Error adding comment: ", err);
    response.status(500).send({ error: "Unable to add comment" });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!user) {
    return response.status(404).json({ error: "User not found" });
  }

  if (!blog) {
    return response.status(404).json({ error: "Blog not found" });
  }
  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(blog.id);
    return response.status(204).send();
  } else {
    return response
      .status(401)
      .json({ error: "Bad request, unauthorized access" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const { title, author, likes } = request.body;
  await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, likes },
    { new: true },
  );
  response.status(204).end();
});

module.exports = blogRouter;
