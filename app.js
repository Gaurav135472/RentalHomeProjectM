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
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");

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


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errorMesaage = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errorMesaage);
    }else{
        next();
    }
}

app.use("/listings", listings);

// reviews post rooute

app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);
   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);
}));

// review delete root

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);
    res.redirect(`/listings/${id}`);
}))

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
