const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMesaage = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMesaage);
    }else{
        next();
    }
}

// reviews post rooute
router.post("/",validateReview, wrapAsync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();
   req.flash("success", "New review created!");
   res.redirect(`/listings/${listing._id}`);
}));

// review delete root

router.delete("/:reviewId", wrapAsync(async(req,res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router;