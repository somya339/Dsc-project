const express = require('express');
const app = require('express')();
const path = require('path');
const mongo = require('./utils/database');
const router = require('./router/router');
const body = require('body-parser');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const init = require('./auth/passport').initalize;
const env = require('dotenv').config();
const users = require('./controllers/controller').users;
app.use(body.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, "public")));
app.set("views", "views");
app.set("view engine", "ejs");

init(passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.use(flash());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())


app.use("/", router);
mongo.connect(() => {
    app.listen(process.env.PORT || 3400, () => {
        console.log("the server is running at port 3400");
    })
});