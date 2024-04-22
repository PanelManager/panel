function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect("/auth/login")
    }
}

function checkNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect("/dash")
    } else {
        next()
    }
}

module.exports = {
    checkAuth,
    checkNotAuth
}