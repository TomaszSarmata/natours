const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

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

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     .json({ message: "Hello from the server side", app: "Natours" });
// });

// app.post("/", (req, res) => {
//   res.status(200).json({ message: "post method works now" });
// });

//reading the file with tours and saving to variable tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2) ROUTE HANDLERS
//refactoring the code here to create a function that will handle the handler functions from each api route to seperate the https type of request and the routing from the handler functions

//adding route handler for get request to return all tours from api endpoint
// app.get("/api/v1/tours", getAllTours);

//Here we are going to define a route that accepts a variable so that we can return just a single tour based on the id
// app.get("/api/v1/tours/:id", getTour);

//adding route handler for post request to allow users adding new tours
// app.post("/api/v1/tours", createTour);

// adding the route handler for patch request
// app.patch("/api/v1/tours/:id", updateTour);

//adding the route handler for delete request
// app.delete("/api/v1/tours/:id", deleteTour);

//3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
