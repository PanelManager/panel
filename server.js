require("dotenv").config()
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const log = require('./handlers/logger');
const db = require('./handlers/db');
const path = require("path")
const passport = require('passport');
const loadPassport = require("./handlers/passport");
const session = require("express-session")
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const bodyParser = require('body-parser');
const flash = require('connect-flash');

app.set("view engine", "html")

app.use(bodyParser.urlencoded({ extended: false }));
loadPassport(passport)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
    },
    store: new SequelizeStore({
        db: db
    })
}))
app.use(passport.initialize());
app.use(passport.session());

// FLASH MESSAGES
app.use(flash())


app.use("/", express.static(path.join(__dirname, "public")))

app.set('view engine', 'njk');

try {
    db.sync()
    db.authenticate()
    log.success("Database is connected successfully")
} catch (err) {
    log.error("Error connecting to database: " + err)
}

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use("/auth", require("./routes/auth"));

app.use("/", require("./routes/index").home);

app.use("/setup", require("./routes/index").setup)


app.listen(8000, () => {
    log.success("Server is listening on port 8000")
})
