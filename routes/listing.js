const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js")
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errorMessage = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMessage);
    } else {
        next();
    }
};

// Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// Route to display form for creating a new listing
router.get("/new", wrapAsync(async (req, res) => {
    res.render("listings/new.ejs");
}));

// Route to display a single listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing doesnot exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// Route to create a new listing
router.post("/", validateListing, wrapAsync(async (req, res) => {
    const listings = req.body.listing;
    const newListings = new Listing(listings);
    await newListings.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// Route to edit a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

// update root
// if the update root dont work then see the databaser as we need to pass all the data in findByIdAndUpdate as all the data listed in database. If we dont have then set the data of edit.ejs file again as data inside the database is listed.
// If it still not woriking then to pass the form data inside this root use the middlewear as shown bellow                                                 const bodyParser = require('body-parser');
// Update route
router.put('/:id', async (req, res) => {
        const { id } = req.params;
        const updatedData = req.body.listings; // Ensure this matches your schema
        await Listing.findByIdAndUpdate(id, updatedData); // correct version
        // incorrect version :  await Listing.findByIdAndUpdate(id, {req.body.listings});
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
});



// Route to delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;
