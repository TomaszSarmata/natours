const Tour = require("../models/tourModel");

exports.getAllTours = async (req, res) => {
  try {
    console.log("here", req.query);

    //BUILD THE QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced Filtering

    const queryStr = JSON.stringify(queryObj);
    queryStr.replace(/\b(gte|gt|lte|lt)\b/g);

    // {difficulty: 'easy', duration: {$gte: 5}
    //  {duration: { gte: '5' }, difficulty: 'easy'}
    // operators to replace gte, gt, lte, lt

    const query = Tour.find(queryObj);

    //EXECUTE THE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    //SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `Error!: ${err}`,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({_id: req.params.id}) that's a longer version of the above

    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `Error! Couldn't find the tour: ${err}`,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: `Invalid Data Sent! ${err}`,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `Error! Couldn't update the value: ${err}`,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      message: "tour successfully deleted",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `Couldn't delete the tour: ${err}`,
    });
  }
};
