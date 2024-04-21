require("dotenv").config()
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const log = require('./handlers/logger');
const db = require('./handlers/db');

try {
    db.authenticate()
    log.success("Database is connected successfully")
} catch (err) {
    log.error("Error connecting to database: " + err)
}

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.use("/", require("./routes/home"));

app.listen(8000, () => {
    log.success("Server is listening on port 8000")
})
