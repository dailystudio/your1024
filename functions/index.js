const fs                    = require("fs");
const path                  = require("path");
const { execSync }          = require('child_process');
const admin                 = require("firebase-admin");
const { onRequest }         = require("firebase-functions/v2/https");
const { onSchedule }        = require("firebase-functions/v2/scheduler");
const {logger, firebase}    = require("devbricksx-js");
const constants             = require("./modules/constants");
const endpointPublic        = require('./endpoints/public');

// Only does this for local emulator
function getActiveProjectAlias() {
    const firebaseRcPath = path.resolve(__dirname, '../.firebaserc');

    if (fs.existsSync(firebaseRcPath)) {
        const firebaseRc = JSON.parse(fs.readFileSync(firebaseRcPath, 'utf-8'));
        const projectId = execSync('firebase use --json').toString();
        const activeProjectId = JSON.parse(projectId).result;
        for (const alias in firebaseRc.projects) {
            if (firebaseRc.projects[alias] === activeProjectId) {
                return alias;
            }
        }
    }

    return 'default'; // Default to 'default' if no alias is found
}

if (process.env.FUNCTIONS_EMULATOR) {
    const alias = getActiveProjectAlias();
    logger.info(`use project: [${alias}]`);
    if (alias !== 'default') {
        require('dotenv').config({
            path: path.resolve(__dirname, `.env.${alias}`)
        });
    } else {
        require('dotenv').config();
    }
}

// Set up your service account JSON file path here
let argv = process.env;
logger.info(`argv: ${JSON.stringify(argv)}`);
let serviceAccount = null

if (argv[constants.ARG_SERVICE_ACCOUNT]) {
    let serviceAccountFile = argv[constants.ARG_SERVICE_ACCOUNT];
    logger.info(`serviceAccountFile: ${serviceAccountFile}`);

    if (fs.existsSync(serviceAccountFile)) {
        logger.info(`using admin account in [${serviceAccountFile}] ...`);
        serviceAccount = require(serviceAccountFile);
    }
}

if (serviceAccount == null) {
    logger.info(`using default admin account in [${constants.DEFAULT_SERVICE_ACCOUNT}] ...`);
    serviceAccount = require(constants.DEFAULT_SERVICE_ACCOUNT);
}

const projectId = serviceAccount.project_id;
logger.info(`endpoints enabled for project: ${projectId}`);

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

firebase.bindFirebaseAdmin(admin);

exports.public = onRequest(
    endpointPublic()
);
