const config = require("./utils/config");
const express = require("express");
const path = require("path");
const app = express();
require("express-async-errors");
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const blogRouter = require("./controller/blogs");
const userRouter = require("./controller/users");
const loginRouter = require("./controller/login");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to mongoDB");
  })
  .catch((err) => {
    logger.error("Error connecting to mongoDB", err.message);
  });

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);
app.use("/api/blogs", middleware.userExtractor, blogRouter);
// app.use('/api/blogs', blogRouter)
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV==="testProd") {
  const staticPath = path.join(__dirname, "dist");
  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

if(process.env.NODE_ENV === "test" || process.env.NODE_ENV === "testProd") {
  const testingRouter = require("./controller/testing");
  app.use("/api/testing", testingRouter);
}

app.use(middleware.requestLogger);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
