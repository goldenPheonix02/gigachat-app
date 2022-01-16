var moment = require('moment'); // require

moment.updateLocale('en', {
    longDateFormat: {
        LT: "h:mm A",
    }
});

function message() {
    return moment().format("LT")
}

module.exports = message;