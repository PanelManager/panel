const express = require('express');
const { checkNotSetup, checkSetup } = require('../handlers/checkAuth');
const router = express.Router();
const router2 = express.Router()

router.get("/", checkSetup, function (req, res) {
    res.render("dash.html", {})
})

router2.get("/", checkNotSetup, function (req, res) {
    res.render("setup.html", {})
})


module.exports.home = router
module.exports.setup = router2