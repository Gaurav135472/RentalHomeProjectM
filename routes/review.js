const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn} = require("../middleware.js");
const { destroyReview, createReview } = require("../controllers/reviews.js");

// reviews post rooute
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

// review delete root

router.delete("/:reviewId", isLoggedIn, wrapAsync(destroyReview))

module.exports = router;