const express = require('express');
const { checkNotAuth, checkSetup } = require('../handlers/checkAuth');
const User = require('../models/UserModel');
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport');
const SettingsModel = require('../models/Settings');
const axios = require('axios')


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
    let ipCheck = await User.findOne({where: { ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress}})
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    if ((await SettingsModel.findOne({where: {key: "registerip"}})).value == 'false') {
        ipCheck = false
        ipAddress = null
    }
    if (userUsername) {
        req.flash("registerError", "User already registered with that username")
        res.redirect("/auth/register")
    } else if (userEmail) {
        req.flash("registerError", "User already registered with that email")
        res.redirect("/auth/register")
    } else if (ipCheck) {
        req.flash("registerError", "User already registered with that IP")
        res.redirect("/auth/register")
    } else {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const panelurl = (await SettingsModel.findOne({ where: { key: "pterourl"}})).value
        const apikey = (await SettingsModel.findOne({ where: { key: "pteroapikey" }})).value
        const user = await axios.post(`${panelurl}/api/application/users`, {
            email: req.body.email,
            username: req.body.username,
            first_name: req.body.username,
            last_name: req.body.username,
            password: req.body.password
        }, {
            headers: {'Authorization': `Bearer ${apikey}`}
        })
        User.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            pteroId: user.data.attributes.id, 
            ipAddress: ipAddress,
            credits: 0,
            verifiedEmail: false
        })
        req.flash("loginSuccess", "User registered successfully")
        res.redirect("/auth/login")
    }
})


module.exports = router