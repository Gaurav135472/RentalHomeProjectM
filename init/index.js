const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wonderlust";

main().then(() => {
  console.log("Connected to DB");
  initDB();
}).catch((err) => {
  console.error("Error connecting to DB:", err);
});

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
  } catch (error) {
    console.error("Error initializing data:", error);
  } 
};
