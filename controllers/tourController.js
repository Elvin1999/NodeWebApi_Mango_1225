const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("../utils/appError");

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

//Middlewares

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
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

exports.createTour = catchAsync(async (req, res,next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

//?limit=5&fiels=name,price,ratingsAverage,summary,difficulty&sort=price,-ratingsAverage
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findById(req.params.id);
  if(!tour){
    return next(new AppError(`No tour find with that ID : ${req.params.id}`,404));
  }
  res.status(200).json({
    status: "success",
    data: tour,
  });
});

exports.updateTour = catchAsync(async (req, res,next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if(!updatedTour){
    return next(new AppError(`No tour find with that ID : ${req.params.id}`,404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res,next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  if(!tour){
    return next(new AppError(`No tour find with that ID : ${req.params.id}`,404));
  }

  res.status(204).json({
    status: "success",
    data: {
      message: "<Deleted tour here...>",
    },
  });
});
