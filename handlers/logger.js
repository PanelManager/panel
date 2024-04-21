const colors = require('colors');

function success(msg) {
    console.log(colors.green("[SUCCESS] ") + msg);
}

function info(msg) {
    console.log(colors.blue("[INFO] ") + msg);
}

function error(msg) {
    console.log(colors.red("[ERROR] ") + msg);
}


module.exports.success = success;
module.exports.info = info;
module.exports.error = error;