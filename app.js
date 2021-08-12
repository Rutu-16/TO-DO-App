const express = require("express");
const Item = require('./models/items');
const app = express();
const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(process.env.MONGODB, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connected")
    app.listen(3000, (req, res) => {
        console.log("Server Started at 3000")
    });
}).catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.set("view engine", 'ejs');



//Home Page
app.get("/", (req, res) => {

    Item.find().then(result => {

        res.render('home', { items: result });
    });

});


//Add Item
app.get("/add-item", (req, res) => {
    res.render('addItem');

});
app.post("/add-item", (req, res) => {

    const item = new Item({
        title: req.body.title
    });
    item.save().then(() => { console.log("Saved Successfully") });
    res.redirect("/");
});



//Edit Item
app.get("/edit-item/:requestedId", (req, res) => {

    Item.findById(req.params.requestedId).then(result => {
        res.render('editItem', { item: result });
    });

});

app.post("/edit-item/:requestedId", (req, res) => {
    Item.findOneAndUpdate(req.params.requestedId, { title: req.body.title }).then(() => {
        res.redirect("/");
    });

});


//Delete Item
app.get("/delete/:id", (req, res) => {

    Item.findByIdAndDelete(req.params.id).then(result => {
        res.redirect("/");
    });
});


app.use((req, res) => {
    res.render('error');
});



