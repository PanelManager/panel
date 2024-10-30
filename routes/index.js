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
const Server = require("../models/Server");
const Plan = require("../models/Plan");
const Egg = require("../models/Egg");


// /DASH

router.get("/", checkSetup, checkAuth, async function (req, res) {
    const serverCount = await Server.count({where: {ownerId: req.user.id}})
    res.render("dash/home.html", {hostname: (await SettingsModel.findOne({where: {name: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {name: "pterourl"}})).value, isAdmin: req.user.admin, page: "Home", serverCount: serverCount})
})

router.get("/servers", checkSetup, checkAuth, async function (req, res) {
    const servers = await Server.findAll({where: {ownerId: req.user.id}})
    const serversArray = await Promise.all(servers.map(async server => {
        const plan = await Plan.findOne({where: {id: server.planId}})
        let serverObject = {
            id: server.id,
            name: server.name,
            plan: plan.name,
            egg: (await Egg.findOne({where: {id: server.eggId}})).name,
            price: plan.price,
            hourPrice: (plan.price / 720).toFixed(2)
        }
        return serverObject;
    }))
    res.render("dash/servers.html", {hostname: (await SettingsModel.findOne({where: {name: "hostname"}})).value, servers: serversArray, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {name: "pterourl"}})).value, isAdmin: req.user.admin, page: "Your servers"})
})


router.get("/profile", checkSetup, checkAuth, async function (req, res) {
    const user = await User.findOne({where: {id: req.user.id}})
    res.render("dash/profile.html", {hostname: (await SettingsModel.findOne({where: {name: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {name: "pterourl"}})).value, isAdmin: req.user.admin, page: "Profile", user: user})
})

// /SETUP

router2.get("/", checkNotSetup, function (req, res) {
    res.render("setup.html", {})
})

router2.post("/", checkNotSetup, async function (req, res) {
    const user = await axios.get(`${req.body.pterourl}/api/application/users/${req.body.pteroid}`, {
        headers: { 'Authorization': `Bearer ${req.body.pteroapikey}` },
        validateStatus: function (status) {
            return status < 500
        }
    })
    if (user.status === 200) {
        // BASIC SETUP
        Settings.create({name: "setup", value: "true", type: "boolean"})
        Settings.create({name: "hostname", value: req.body.hostname, type: "string"})
        Settings.create({name: "pterourl", value: req.body.pterourl, type: "string"})
        Settings.create({name: "pteroapikey", value: req.body.pteroapikey, type: "string"})
        Settings.create({name: "registerip", value: "false", type: "boolean"})

        // ADMIN SETUP
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress
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
    } else {
        res.render("setup.html", {setupError: "Invalid Pterodactyl API Key or URL"})
    }
})


module.exports.home = router
module.exports.setup = router2