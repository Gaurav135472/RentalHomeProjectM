const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { redirect } = require("express/lib/response.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema, reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
console.log("Views", path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
    console.log("Connected to db")
}).catch(()=> {
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URL);
}

app.get("/", (req,res) => {
    res.send("Hi, I am root")
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errorMesaage = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMesaage);
    }else{
        next();
    }
}
const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMesaage = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMesaage);
    }else{
        next();
    }
}
// index root
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// new listing root
app.get("/listings/new", wrapAsync(async(req,res) => {
    res.render("listings/new.ejs");
}))

// create new listings root
app.post("/listings", validateListing, wrapAsync(async(req,res,next) => {
    let listings = req.body.listing;
    const newListings = new Listing(listings);
    await newListings.save();
    res.redirect("/listings");
}))

// show listing root
app.get("/listings/:id", wrapAsync( async(req,res) => {
  let  {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs", {listing});
}));

// edit listing root
app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
     let  {id} = req.params;
  const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));


// update root
// if the update root dont work then see the databaser as we need to pass all the data in findByIdAndUpdate as all the data listed in database. If we dont have then set the data of edit.ejs file again as data inside the database is listed.
// If it still not woriking then to pass the form data inside this root use the middlewear as shown bellow                                                 const bodyParser = require('body-parser');

app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
        const { id } = req.params;
        const updatedData = req.body.listings; // Ensure this matches your schema
        await Listing.findByIdAndUpdate(id, updatedData); // correct version
        // incorrect version :  await Listing.findByIdAndUpdate(id, {req.body.listings});
        res.redirect(`/listings/${id}`);
}));

// detele root 
app.delete('/listings/:id', wrapAsync( async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
}));

// reviews post rooute

app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);
}));



// app.get("/testListing",async(req,res) => {

//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "it has temple at home",
//         price: "2000",
//         location: "visnagar Gujarat",
//         country: "India",
//     })

//     await sampleListing.save();
//     console.log("Sample is saved");
//     res.send("Successful testing");
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "page not found!"));
})
app.use((err, req, res, next) => {
    let{statusCode=500, message = "Something went wrong!"} = err;
   
res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message)
})
app.listen(8080, () => {
    console.log("The server is working on port 8080");
});
