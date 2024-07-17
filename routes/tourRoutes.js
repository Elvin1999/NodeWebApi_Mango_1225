const express = require("express");
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
const router = express.Router();

router.param("id", tourController.checkId);

//As Task

// Create a checkBody middleware
// Check if body contains the name and price property
//If not , send back 400 (bad request)
// Add it to the post handler stack

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
