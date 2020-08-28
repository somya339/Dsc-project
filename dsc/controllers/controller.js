const mail = require('nodemailer');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
let otp = Math.floor(Math.random() * 2000 + Math.random() * 2000 + Math.random() * 2000 + Math.random() * 2000 + Math.random() * 2000 + 4).toString();
if (otp.length < 4) {
    otp = "0" + otp;
}
let details;
console.log(otp);
let transporter = mail.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})
const signup = require('../model/model');
exports.getSignup = (req, res) => {
    res.render("index", {
        err: req.flash("err"),
        auth : req.flash("unauthorised"),
    });
}
exports.postSignup = (req, res) => {
    signup.fetch(req.body.email, req.body.username, (result) => {
        console.log(result);
        req
        if (result == null) {
            let mailoptions = {
                from: process.env.EMAIL,
                to: `${req.body.email}`,
                subject: "test working",
                html: `<p>Your OTP is</p> ${otp}`
            };
            setTimeout(() => {
                otp = "";
            }, 200000);

            transporter.sendMail(mailoptions, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("MAIL sent!");
                }
            });
            bcrypt.hash(req.body.password, 12, (err, result) => {
                console.log(result)
                signup.fetch(req.body.email, req.body.username, (result) => {
                    if (result == null) {
                        const model = new signup(req.body.username, req.body.email, result);
                        model.save();
                        req.session.isLoggedIn = true;
                        res.redirect("/otp");
                    } else {
                        req.flash("signup");
                        res.redirect("/signup");
                    }
                })
            })
        } else {
            res.redirect("/signup");
        }
    })
}
exports.getOtp = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.render("otp", {})
    }
    req.flash("unauthorised" , "You need to Either Signup or Login");
    res.redirect("/signup");
}

exports.postOtp = (req, res) => {
    if (otp == req.body.otp) {
        res.redirect("/login");
    } else {
        req.flash("err", "the otp is wrong");
        res.redirect("/signup");
    }
}


exports.getlogin = (req, res) => {
    res.render("login", {
        err: req.flash("login")
    });
}
exports.postLogin = (req, res) => {
    console.log(req.body.username);
    let password = req.body.password
    signup.check_cred(req.body.username, (result) => {
        console.log(result);
        bcrypt.compare(password, result.password, (err, compared) => {
            if (compared == false) {
                req.flash("login", "Your Name Or Password Is In Correct");
                return res.redirect("/login");
            } else {
                req.session.isLoggedIn = true;
                req.session.name = req.body.username;
                return res.redirect("/home");
            }
        })
    })
}
exports.getHome = (req, res) => {
    if (req.session.isLoggedIn) {
        return res.render("home", {
            name: req.session.name
        })
    }
    req.flash("unauthorised" , "You need to Either Signup or Login");
    res.redirect("/signup");
}