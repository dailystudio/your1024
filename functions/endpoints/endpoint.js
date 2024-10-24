const fs            = require('fs');
const express       = require('express');
const cors          = require('cors')({origin: true});
const fileutils     = require('devbricksx-js').fileutils;
const firebaseAuth  = require('devbricksx-js').firebaseAuth;
const logger        = require('devbricksx-js').logger;
const constants     = require('../modules/constants.js');

module.exports = function (requireToken=true) {
    let argv = process.env;

    logger.info(`requireToken: ${requireToken}`);
    logger.info(`application arguments: ${JSON.stringify(argv, null, " ")}`);
    logger.enableDebugOutputs(argv);

    const app = express();

    if (requireToken) {
        const bypassTokensFile = argv[constants.ARG_BYPASS_TOKENS_FILE];
        if (argv[constants.ARG_IGNORE_TOKEN_VALIDATION] === true) {
            logger.warn("Ignore Firebase auth token validation.");
        } else {
            logger.info(`Enable Firebase auth token validation. [by-pass = ${bypassTokensFile}]`);

            if (bypassTokensFile !== undefined && fs.existsSync(bypassTokensFile)) {
                let tokens = fileutils.jsonFromFile(bypassTokensFile);
                require('../modules/bypass_token_validator.js')(app, tokens);
            } else {
                app.use(firebaseAuth.validateFirebaseIdToken);
            }
        }
    }

    app.use(cors);

    return app
}
