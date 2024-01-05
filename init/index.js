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
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "658f3633c70adffc9025862e"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
