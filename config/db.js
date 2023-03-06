const mongoClient = require('mongodb').MongoClient;
let CONSTANTS = require('./constants');
let mongoDbUrl = CONSTANTS.value.MONGODBURL;
let DBName = CONSTANTS.value.DBNAME;
let mongodb;
let client;
function connect(callback){
    mongoClient.connect(mongoDbUrl, { useNewUrlParser: true,  useUnifiedTopology: true }, (err, client) => {
        mongodb = client.db(DBName);
        client = client;
        callback();
    });
}
function get(){
    return mongodb;
}

function close(){
    client.close();
}

module.exports = {
    connect,
    get,
    close
};