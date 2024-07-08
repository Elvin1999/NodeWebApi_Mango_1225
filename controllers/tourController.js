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

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // 2) Advanced Filtering         //gte , gt , lte , lt
    let queryStr = JSON.stringify(queryObj); //price[lte]=500
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    console.log(JSON.parse(queryStr));

    this.query.find(JSON.parse(queryStr));
  }
}

//?limit=5&fiels=name,price,ratingsAverage,summary,difficulty&sort=price,-ratingsAverage
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price,-ratingsAverage";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
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
    // const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => {
    //   delete queryObj[el];
    // });

    // // 2) Advanced Filtering         //gte , gt , lte , lt
    // let queryStr = JSON.stringify(queryObj); //price[lte]=500
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // console.log(JSON.parse(queryStr));

    // let query = Tour.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Fields Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    //Pagination
    //url?page=1&limit=50

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error("This page does not exist");
      }
    }

    query = query.skip(skip).limit(limit);
    const tours = await query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
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
