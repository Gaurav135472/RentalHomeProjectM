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
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
console.log("Views", path.join(__dirname, 'views'));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(flash());

const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";


main().then(() => {
    console.log("Connected to db")
}).catch(()=> {
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URL);
}

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 *24 * 60 * 60 *1000,
        maxAge: 7 *24 * 60 * 60 *1000,
        httpOnly: true,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req,res) => {
    res.send("Hi, I am root")
});



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/demouser", async(req,res) => {
    let fakeUser = new User({
        email : "student@gmail2.com",
        username: "delta-student3"
    });

    let registerUser =await User.register(fakeUser,"Gaurav@0782");
    res.send(registerUser);
    console.log(registerUser);

})



app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews );


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
