const express = require("express")
const router = express.Router()
const { checkAuth, checkSetup, checkAdmin } = require("../handlers/checkAuth") 
const SettingsModel = require("../models/Settings")
const { sha256 } = require('js-sha256');
const UserModel = require("../models/UserModel")
const axios = require("axios")
const Node = require("../models/Node")
const Egg = require("../models/Egg")
const Server = require("../models/Server")

router.use(checkAdmin)

router.get("/", checkAuth, checkAdmin, function (req, res) {
    res.redirect("/admin/overview")
})

router.get("/overview", checkAuth, checkAdmin, async function (req, res) {
    const usersCount = await UserModel.count()
    const nodesCount = await Node.count()
    const eggsCount = await Egg.count()
    const serversCount = await Server.count()
    res.render("admin/overview.html", {hostname: (await SettingsModel.findOne({where: {name: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {name: "pterourl"}})).value, isAdmin: req.user.admin, page: "Overview", users: usersCount, nodes: nodesCount, eggs: eggsCount, servers: serversCount})
})

router.get("/users", checkAuth, checkAdmin,  async function (req, res) {
    const users = await UserModel.findAll()
    res.render("admin/users.html", {hostname: (await SettingsModel.findOne({where: {name: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {name: "pterourl"}})).value, isAdmin: req.user.admin, page: "Users", users: users})
})


router.get("/sync", checkAuth, async function (req, res) {
    const panelurl = (await SettingsModel.findOne({where: {name: "pterourl"}})).value
    const apikey = (await SettingsModel.findOne({where: {name: "pteroapikey"}})).value
    // SYNC NODES
    const nodes = await axios.get(`${panelurl}/api/application/nodes`, {
        headers: { 'Authorization': `Bearer ${apikey}` }
    })
    nodes.data.data.forEach(async (node) => {
        const nodeDb = await Node.findOne({where: {pteroId: node.attributes.id}})
        if (nodeDb) {
            nodeDb.name = node.attributes.name
            //nodeDb.cpu = node.attributes.cpu // TODO: Get CPU information from API
            nodeDb.ram = node.attributes.memory
            nodeDb.disk = node.attributes.disk
            nodeDb.save()
            return
        }
        Node.create({
            name: node.attributes.name,
            pteroId: node.attributes.id,
            //cpu: node.attributes.cpu, // TODO: Get CPU information from API
            ram: node.attributes.memory,
            disk: node.attributes.disk,
        })
    })

    // SYNC EGGS
    const nests = await axios.get(`${panelurl}/api/application/nests`, {
        headers: { 'Authorization': `Bearer ${apikey}` }
    })
    nests.data.data.forEach(async (nest) => {
        const eggs = await axios.get(`${panelurl}/api/application/nests/${nest.attributes.id}/eggs`, {
            headers: { 'Authorization': `Bearer ${apikey}` }
        })
        eggs.data.data.forEach(async (egg) => {
            const eggDb = await Egg.findOne({where: {pteroId: egg.attributes.id}})
            if (eggDb) {
                eggDb.name = egg.attributes.name
                eggDb.save()
                return
            }
            Egg.create({
                name: egg.attributes.name,
                pteroId: egg.attributes.id,
            })
        })
    })
    res.redirect("/admin")
})

module.exports = router