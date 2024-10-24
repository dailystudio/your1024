const endpoint          = require("./endpoint");

module.exports = function () {
    let app = endpoint(false);

    app.use(require('../api/publicapi.js'));

    return app
}
