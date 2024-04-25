const express = require('express');
const { checkNotSetup, checkSetup } = require('../handlers/checkAuth');
const Settings = require('../models/Settings');
const User = require('../models/UserModel');
const router = express.Router();
const router2 = express.Router()
const bcrypt = require('bcrypt')
const axios = require('axios')

router.get("/", checkSetup, function (req, res) {
    res.render("dash.html", {})
})

router2.get("/", checkNotSetup, function (req, res) {
    res.render("setup.html", {})
})

router2.post("/", checkNotSetup, async function (req, res) {
    // BASIC SETUP
    Settings.create({key: "setup", value: "true", type: "boolean"})
    Settings.create({key: "hostname", value: req.body.hostname, type: "string"})
    Settings.create({key: "pterourl", value: req.body.pterourl, type: "string"})
    Settings.create({key: "pteroapikey", value: req.body.pteroapikey, type: "string"})

    // ADMIN SETUP
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const user = await axios.get(`${req.body.pterourl}/api/application/users/${req.body.pteroid}`, {
        headers: { 'Authorization': `Bearer ${req.body.pteroapikey}` }
    })
    User.create({username: user.data.attributes.username, password: hashedPassword, email: user.data.attributes.email, admin: true, pteroId: req.body.pteroid, ipAddress: ipAddress})
    /*await axios.patch(`${req.body.pterourl}/api/application/users/${req.body.pteroid}`, { 
        headers: { 'Authorization': `Bearer ${req.body.pteroapikey}` },
        data: [
            {
                password: req.body.password
            }
        ]
    })*/ // TODO: FIX PASSWORD UPDATE
    res.redirect("/auth/login")
})


module.exports.home = router
module.exports.setup = router2