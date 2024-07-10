const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  //const token = signToken(newUser.id);

  res.status(201).json({
    status: "success",
    //  token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // 1)Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2)Check if user exists && password is correct

  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything is okay , send token to client

  const token = signToken(user.id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = (req, res, next) => {
  // 1) Getting token and check it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2)Verification Token  ------------------ will continue

  if (!token) {
    return next(
      new AppError("You are not logged in! PLease log in to get access"),
      401
    );
  }

  // 3)Check if user still exists

  // 4)Check if user changed password after token was issued

  next();
};
