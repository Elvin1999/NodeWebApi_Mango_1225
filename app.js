const express = require("express");
const fs = require("fs");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const path = require('path');

// 1) Middlewares

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});


app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//2 Routes
app.use("/api/v1/tours", tourRouter);

app.use("/api/v1/users", userRouter);

//3 Start Server

module.exports = app;
