const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json()); //we added middleware here, that will add the data to the req.body (created the body on the req actually)

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

//refactoring the code here to create a function that will handle the handler functions from each api route to seperate the https type of request and the routing from the handler functions
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
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

app.route("/api/v1/tours").get(getAllTours).post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
