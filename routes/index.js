const express = require('express');
const { checkNotSetup, checkSetup, checkAuth } = require('../handlers/checkAuth');
const Settings = require('../models/Settings');
const User = require('../models/UserModel');
const router = express.Router();
const router2 = express.Router()
const bcrypt = require('bcrypt')
const axios = require('axios');
const SettingsModel = require('../models/Settings');
const { sha256 } = require('js-sha256');

router.get("/", checkSetup, checkAuth, async function (req, res) {
    res.render("dash.html", {hostname: (await SettingsModel.findOne({where: {key: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {key: "pterourl"}})).value})
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
    Settings.create({key: "registerip", value: "false", type: "boolean"})

    // ADMIN SETUP
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const user = await axios.get(`${req.body.pterourl}/api/application/users/${req.body.pteroid}`, {
        headers: { 'Authorization': `Bearer ${req.body.pteroapikey}` }
    })
    User.create({username: user.data.attributes.username, password: hashedPassword, email: user.data.attributes.email, admin: true, pteroId: req.body.pteroid, ipAddress: ipAddress})
    const passwordUpdate = await axios.patch(`${req.body.pterourl}/api/application/users/${req.body.pteroid}`,  {
        username: user.data.attributes.username,
        email: user.data.attributes.email,
        password: req.body.password,
        first_name: user.data.attributes.first_name,
        last_name: user.data.attributes.last_name,
    }, { 
        headers: { 'Authorization': `Bearer ${req.body.pteroapikey}` },
    })
    res.redirect("/auth/login")
})


module.exports.home = router
module.exports.setup = router2