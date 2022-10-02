const express = require("express");
const path = require("path");

const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbUrl = "mongodb://localhost:27017/userFeedbacks";
var db, feedbackList;

mongo.connect(dbUrl, (error, client) => {
  db = client.db("userFeedbacks");
  refreshFeedbacks();
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.render("index", { title: "Home" });
});

app.get("/product", (request, response) => {
  response.render("product", { title: "Products" });
});

app.get("/about", (request, response) => {
  response.render("about", { title: "About Us" });
});

app.get("/contact", (request, response) => {
  response.render("contact", { title: "Contact", list: feedbackList });
});

app.post("/contact/add", (request, response) => {
  let name = request.body.name;
  let review = request.body.review;
  let newEntry = {
    name: name,
    review: review,
  };
  db.collection("feedback").insertOne(newEntry, (err, result) => {
    if (err) throw err;
    refreshFeedbacks();
    response.redirect("/contact");
  });
});
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});

function refreshFeedbacks() {
  db.collection("feedback")
    .find({})
    .toArray((err, result) => {
      feedbackList = result;
    });
}
