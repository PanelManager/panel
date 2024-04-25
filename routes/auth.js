const express = require('express');
const { checkNotAuth, checkSetup } = require('../handlers/checkAuth');
const User = require('../models/UserModel');
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport');
const SettingsModel = require('../models/Settings');

router.use(checkSetup)

router.get("/login", checkNotAuth, function (req, res) {
    res.render("auth/login.html", { loginSuccess: req.flash("loginSuccess")})
})

router.post("/login", checkNotAuth, passport.authenticate("local", {
    successRedirect: "/dash",
    failureRedirect: "/auth/login",
    failureFlash: true
}))


router.get("/register", checkNotAuth, async function (req, res) {
    const hostname = await SettingsModel.findOne({where: {key: "hostname"}})
    res.render("auth/register.html", { registerError: req.flash("registerError"), hostname: hostname.value})
})

router.post("/register", checkNotAuth, async function (req, res) {
    const userUsername = await User.findOne({ where: { username: req.body.username}})
    const userEmail = await User.findOne({ where: { email: req.body.email}})
    if (userUsername) {
        req.flash("registerError", "User already registered with that username")
        res.redirect("/auth/register")
    } else if (userEmail) {
        req.flash("registerError", "User already registered with that email")
        res.redirect("/auth/register")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        User.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            pteroId: 0, // TODO: Implement Ptero API
            ipAddress: "", // TODO: Register IP address
            credits: 0,
            verifiedEmail: false
        })
        req.flash("loginSuccess", "User registered successfully")
        res.redirect("/auth/login")
    }
})


module.exports = router