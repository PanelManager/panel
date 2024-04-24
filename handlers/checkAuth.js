const Settings = require("../models/Settings");

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/auth/login")
    }
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("/")
    } else {
        next()
    }
}

async function checkSetup(req, res, next) {
    const findRow = await Settings.findOne({ where: { key: "setup", value: "true" } })
    if (findRow) {
        next()
    } else {
        res.redirect("/setup")
    }
}

async function checkNotSetup(req, res, next) {
    const findRow = await Settings.findOne({ where: { key: "setup", value: "true" } })
    if (!findRow) {
        next()
    } else {
        res.redirect("/")
    }
}

module.exports = {
    checkAuth,
    checkNotAuth,
    checkSetup,
    checkNotSetup
}