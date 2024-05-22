const express = require("express")
const router = express.Router()
const { checkAuth, checkSetup, checkAdmin } = require("../handlers/checkAuth") 
const SettingsModel = require("../models/Settings")
const { sha256 } = require('js-sha256');
const UserModel = require("../models/UserModel")

router.use(checkAdmin)

router.get("/users", checkAuth, checkSetup, async function (req, res) {
    const users = await UserModel.findAll()
    res.render("admin/users.html", {hostname: (await SettingsModel.findOne({where: {key: "hostname"}})).value, username: req.user.username, gravatarhash: sha256(req.user.email), credits: req.user.credits, pterourl: (await SettingsModel.findOne({where: {key: "pterourl"}})).value, isAdmin: req.user.admin, page: "Users", users: users})
})

module.exports = router