const Web3 = require('web3');
let config = require('../config/environments/development');
const axios = require('axios');


const provider = new Web3.providers.HttpProvider(
    config.HyperspaceRPC
);
 
const web3 = new Web3(provider);
async function call() {
console.log(config.FilMasterAddress);
let instance = new web3.eth.Contract(config.FilMasterABI, config.FilMasterAddress);
let profileInfo = await instance.methods._memberProfileById(1).call()
console.log(profileInfo);
  

}

call()

