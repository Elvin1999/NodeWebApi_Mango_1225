const fs = require("fs");
const Tour = require("./../models/tourModel");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Middlewares

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  // const tour = tours.find((t) => t.id === val * 1);
  // if (!tour) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid ID",
  //   });
  // }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "fail",
      message: "Missing name or price",
    });
  }
  next();
};

//Functions

exports.createTour = async (req, res) => {
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);
    console.log(newTour);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllTours = async (req, res) => {
  try {
    // console.log((req.query));
    // const tours = await Tour.find({
    //   duration:5,
    //   difficulty:'easy'
    // });

    // console.log((req.query));
    // const tours = await Tour.find(req.query);

    // const tours = await Tour.find()
    //   .where("duration")
    //   .equals(5)
    //   .where("difficulty")
    //   .equals("easy");

    console.log(req.query);

    //BUILD QUERY
    // 1) Filtering
    const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => {
    //   delete queryObj[el];
    // });

    // 2) Advanced Filtering         //gte , gt , lte , lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    console.log(JSON.parse(queryStr));

    const tours = await Tour.find(JSON.parse(queryStr));

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log(req.params);
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: {
        message: "<Deleted tour here...>",
      },
    });
  } catch (err) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
};
