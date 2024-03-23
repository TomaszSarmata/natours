const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

//1) MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json()); //we added middleware here, that will add the data to the req.body (created the body on the req actually)

//my own middleware here
app.use((req, res, next) => {
  console.log("hello from the middleware ");
  next(); //always call next function!!!
});

//my own middleware to manipulate the response a little. Adding the current time to the req
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
