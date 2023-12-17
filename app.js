const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const { redirect } = require("express/lib/response.js");
const ejsMate = require("ejs-mate");

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


// index root
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
});

// new listing root
app.get("/listings/new", async(req,res) => {
    res.render("listings/new.ejs");
})

// create new listings root
app.post("/listings", async(req,res) => {
    let listings = req.body.listing;
    const newListings = new Listing(listings);
    await newListings.save();
    res.redirect("/listings");

})

// show listing root
app.get("/listings/:id", async(req,res) => {
  let  {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
});

// edit listing root
app.get("/listings/:id/edit",async(req,res) => {
     let  {id} = req.params;
  const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});


// update root
// if the update root dont work then see the databaser as we need to pass all the data in findByIdAndUpdate as all the data listed in database. If we dont have then set the data of edit.ejs file again as data inside the database is listed.
// If it still not woriking then to pass the form data inside this root use the middlewear as shown bellow                                                 const bodyParser = require('body-parser');

app.put('/listings/:id', async (req, res) => {
        const { id } = req.params;
        const updatedData = req.body.listings; // Ensure this matches your schema
        await Listing.findByIdAndUpdate(id, updatedData); // correct version
        // incorrect version :  await Listing.findByIdAndUpdate(id, {req.body.listings});
        res.redirect(`/listings/${id}`);
});

// detele root 
app.delete('/listings/:id', async (req, res) => {
        const { id } = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
});





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

app.listen(8080, () => {
    console.log("The server is working on port 8080")
});