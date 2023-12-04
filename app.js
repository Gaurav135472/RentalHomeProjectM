const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
console.log("Views", path.join(__dirname, 'views'));


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

app.get("/listing/newForm", async(req,res) => {
    res.render("new.ejs");
})


app.get("/listings/:id", async(req,res) => {
  let  {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
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