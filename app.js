//jshint esversion:6

// modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


// dummy content
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// create DB & connect to it
mongoose.connect("mongodb://localhost:27017/blogPosts", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// create schema
const postSchema = new mongoose.Schema({
    name: String,
    content: String
});

// create mongoose model/collection based on the schema
const Post = new mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
    // get all posts in db
    Post.find({}, function(err, foundPosts) {
        // if errr log error
        if (err) {
            console.log(err);
        } else {
            // render home content and pass the array returned from find()
            // the loop is handled in the home.ejs page
            res.render("home", {
                startingContent: homeStartingContent,
                posts: foundPosts
            });
        }
    });
});

app.post("/compose", function(req, res) {
    // create new entry in db
    const newPost = new Post({
        name: req.body.postTitle,
        content: req.body.postBody
    });
    // check if save was successfull
    newPost.save(function(err) {
        // if no errors redirect to home page
        if (!err) {
            res.redirect("/");
        }

    });


});

// when user clicks read me linl
app.get("/posts/:postId", function(req, res) {
    // post id
    const postId = req.params.postId;
    // find post using id
    Post.findOne({
        _id: postId
    }, function(err, post) {

        // render post page
        res.render("post", {

            title: post.name,

            content: post.content

        });

    });


});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});

app.get("/about", function(req, res) {
    res.render("about", {
        aboutContent: aboutContent
    });
});

app.get("/contact", function(req, res) {
    res.render("contact", {
        contactContent: contactContent
    });
});

app.get("/compose", function(req, res) {
    res.render("compose");
});
