const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json()); //we added middleware here, that will add the data to the req.body

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

//adding route handler for get request to return all tours from api endpoint
app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

//adding route handler for post request to allow users adding new tours
app.post("/api/v1/tours", (req, res) => {
  console.log(req.body);
  res.send("Done");
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
