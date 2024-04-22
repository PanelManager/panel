const express = require('express');
const { checkNotAuth } = require('../handlers/checkAuth');
const router = express.Router()

router.get("/login", checkNotAuth, function (req, res) {
    res.render("auth/login.html")
})


router.get("/register", checkNotAuth, function (req, res) {
    res.render("auth/register.html")
})

module.exports = router