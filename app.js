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
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1; //creating the new id for the new entry;
  //below creating our entry object that will be data in the req.body and the newId - we have to merge both and so we use Object.assign
  newTour = Object.assign({ id: newId }, req.body);

  //here we are simply pushing that new entry into our list of tours
  tours.push(newTour);

  //now we have to persist new entry
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated Tour here...>",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    message: "tour successfully deleted",
    data: null,
  });
};

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

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!",
  });
};

//3) ROUTES

const tourRouter = express.Router();

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

//here we are going to use our user resource to create different routes

app.route("/api/v1/users").get(getAllUsers).post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//START THE SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
