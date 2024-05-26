const express = require("express");
const validUrl = require("valid-url");
const bodyParser = require("body-parser");
const ShortUniqueId = require("short-unique-id");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
const uid = new ShortUniqueId({ length: 7 });
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
dotenv.config();

try {
  const URL = process.env.MONGO_DB;

  mongoose.connect(URL, { dbName: "urlShortner" });

  console.log("Connected to database");
} catch (error) {
  console.error("Error connecting to the database ", error.message);
}

const urlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  orignalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  visitCount: {
    type: Number,
    required: true,
    default: 0,
  },
});

const UrlModel = mongoose.model("Url", urlSchema);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/", async (req, res) => {
  const suspect = req.body.url;
  if (validUrl.isUri(suspect)) {
    let isUnique = false;
    let newUrlId;

    while (!isUnique) {
      newUrlId = uid.rnd();
      try {
        const exsistingUrl = await UrlModel.findOne({ urlId: newUrlId });
        isUnique = !exsistingUrl;
      } catch (error) {
        console.error("Error checking id", error.message);
      }
    }

    const newUrl = `https://shrtn.com/${newUrlId}`;

    const newUrlData = new UrlModel({
      urlId: newUrlId,
      orignalUrl: suspect,
      shortUrl: newUrl,
    });
    console.log(newUrlId);
    newUrlData
      .save()
      .then((savedData) => {
        console.log("Data Saved Successfully: ", savedData);
      })
      .catch((error) => {
        console.error("Error while saving the data: ", error.message);
      });
  } else {
    //yeh abhi karna h
  }
});

app.get("/:uniqueId", async (req, res) => {
  try {
    const uniqueId = req.params.uniqueId;
    const url = await UrlModel.findOne({ urlId: uniqueId });
    // console.log(url);
    if (url) {
      await UrlModel.updateOne(
        { urlId: uniqueId },
        { $inc: { visitCount: 1 } }
      );
      return res.redirect(url.orignalUrl);
    } else {
    }
  } catch (error) {
    console.error("Server Error: ", error.message);
  }
});

app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
