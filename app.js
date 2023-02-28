require("dotenv").config();
const express = require('express');
app = express();
const bodyparser = require('body-parser');
let cors = require('cors');
app.use(bodyparser.json({
    extended: true
}));

app.use(cors({methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH', 'OPTIONS'],  origin : '*'}));


var ENV_CONFIG;
if (process.env.ENV_CONFIG == 'PROD') {
    ENV_CONFIG = require('./config/environments/production');
} else if (process.env.ENV_CONFIG == 'STAGING') {
    ENV_CONFIG = require('./config/environments/staging'); 
} else {
    ENV_CONFIG = require('./config/environments/development');
}
global.global.envConfig = ENV_CONFIG;
let CONSTANTS = require('./config/constants')


// const CORS_ALLOWED = CONSTANTS.value.CORS_ALLOWED;
// if (CORS_ALLOWED == "true") {
//     var whitelist = CONSTANTS.value.WHITE_LIST_URLS;
//     console.log(whitelist);
//     var corsOptions = {
//       origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//           callback(null, true)
//         } else {
//           callback('Are you a bot?')
//         }
//       }
//     }
//     app.use(cors(corsOptions));
// }
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Filster API Gateway!' });
});
require("./config/routes")(app);

const _db = require('./config/db');

    _db.connect(async () => {
        console.log(`DB connection successfully established to ${CONSTANTS.value.DBNAME}`);
        app.listen(CONSTANTS.value.PORT || 3000, () => {
            console.log(`listening on ${CONSTANTS.value.PORT}!`);
        });
    });

    

module.exports = app;