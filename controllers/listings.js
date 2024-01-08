const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

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
     let response = await geocodingClient.forwardGeocode({
     query: req.body.listing.location,
     limit: 1
        })
    .send()
        
     let url = req.file.path;
    let filename = req.file.filename;
    console.log(url , filename);
    let listings = req.body.listing;
    const newListings = new Listing(listings);
     newListings.owner = req.user._id;
     newListings.image = {url, filename};
     newListings.geometry = response.body.features[0].geometry;
    let savedListing = await newListings.save();
    console.log(savedListing);
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
         console.log(req.body); // Log the body to see the structure
    console.log(req.file);
        const { id } = req.params;
        const updatedData = req.body.listings; // Ensure this matches your schema
        let listing = await Listing.findByIdAndUpdate(id, updatedData); // Fetch updated document

        if (req.file) {
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            await listing.save();
        }

        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};

