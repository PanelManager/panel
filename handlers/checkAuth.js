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
    const findRow = await Settings.findOne({ where: { name: "setup", value: "true" } })
    if (findRow) {
        next()
    } else {
        res.redirect("/setup")
    }
}

async function checkNotSetup(req, res, next) {
    const findRow = await Settings.findOne({ where: { name: "setup", value: "true" } })
    if (!findRow) {
        next()
    } else {
        res.redirect("/")
    }
}

async function checkAdmin(req, res, next) {
    if (req.user.admin) {
        next()
    } else {
        res.redirect("/dash")
    }
}

module.exports = {
    checkAuth,
    checkNotAuth,
    checkSetup,
    checkNotSetup,
    checkAdmin
}