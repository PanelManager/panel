const express = require('express');
const { checkNotSetup, checkSetup, checkAuth } = require('../handlers/checkAuth');
const router = express.Router();
const Server = require("../models/Server");
const Egg = require("../models/Egg");
const Plan = require("../models/Plan");
const SettingsModel = require("../models/Settings");
const { sha256 } = require('js-sha256');


router.get("/", checkSetup, checkAuth, async function (req, res) {
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



module.exports = router