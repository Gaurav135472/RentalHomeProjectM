const Listing = require("../models/listing.js");
const User = require('../models/user'); // Adjust the path as per your project structure


module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WonderLust");
            res.redirect("/listings");
        });

    } catch (e) {
        console.error("Signup error:", e); // Log the complete error object
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


module.exports.renderSignupForm = (req,res) => {
    res.render("users/signup.ejs");
};

module.exports.renderloginForm = (req,res) => {
    res.render("users/login.ejs");
};

module.exports.login = async(req,res) => {
    req.flash("success", "Welcome to WonderLust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
     req.logout((err) => {
        if(err) {
           return next(err);
        }
         req.flash("success", "You logged out!");
    res.redirect("/listings");
     })
};