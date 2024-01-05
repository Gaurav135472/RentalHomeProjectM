const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate: {path: "author"},}).populate("owner");
    if(!listing){
        req.flash("error", "Listing doesnot exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async(req,res,next) => {
     let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , filename);
    let listings = req.body.listing;
    const newListings = new Listing(listings);
     newListings.owner = req.user._id;
     newListings.image = {url, filename};
    await newListings.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};
module.exports.updateListing = async(req, res) => {
        const { id } = req.params;

        let listing = await Listing.findById(id);
        const updatedData = req.body.listings; // Ensure this matches your schema
        await Listing.findByIdAndUpdate(id, updatedData); // correct version
        // incorrect version :  await Listing.findByIdAndUpdate(id, {req.body.listings});
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};
module.exports
module.exports
module.exports