const express = require("express");
const controller = require("./../controllers/tourController");
const router = express.Router();

router.param("id", controller.checkId);

//As Task

// Create a checkBody middleware
// Check if body contains the name and price property
//If not , send back 400 (bad request)
// Add it to the post handler stack

router.route("/")
.get(controller.getAllTours)
.post(controller.checkBody,controller.createTour);

router
  .route("/:id")
  .get(controller.getTour)
  .patch(controller.updateTour)
  .delete(controller.deleteTour);

module.exports = router;
