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

// const testTourDoc = new Tour({
//   name: "The Park Camper",
//   //rating: 4.7,
//   price: 997,
// });

// testTourDoc
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(`Error : ${err}`);
//   });

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
    const tours = await Tour.find();
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

exports.updateTour = (req, res) => {
  var body = req.body;
  console.log(body);
  var params = req.params;
  var id = 1 * params["id"];

  var tour = tours.find((t) => t.id == id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      message: "<Updated tour here...>",
    },
  });
};

exports.deleteTour = (req, res) => {
  var params = req.params;
  var id = 1 * params["id"];

  var tour = tours.find((t) => t.id == id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: {
      message: "<Deleted tour here...>",
    },
  });
};
