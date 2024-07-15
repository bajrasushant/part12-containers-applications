const bcrypt = require("bcrypt");
const User = require("../models/user");
const userRouter = require("express").Router();

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;
  if (!username || !password || username.trim() === "" || password.trim() === "") {
    return response.status(401).json({ error: "username and password both required" });
  }

  if(!(username.length >= 3 && password.length >= 3)) {
    return response.status(401).json({ error: "username and password should contain atleast 3 characters" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs",{ url:1, title:1,author:1,id:1 }).select("username name id blogs");
  response.json(users);
});

module.exports = userRouter;
