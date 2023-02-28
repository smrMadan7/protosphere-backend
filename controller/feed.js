let constants = require('../config/constants');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');

let {User,Posts} = require('../config/collection');
const provider = new Web3.providers.HttpProvider(
    constants.HyperspaceRPC
);
const web3 = new Web3(provider);


exports.getFeed = async (req, res) => {
    try {
      let { address } = req.params;
      if (!address) {
        res.statusCode = 400;
        res.json({ staus: false, message: "Invalid params" });
      }else{
        console.log(Posts);
        let feed = await _db.get().collection(Posts).find({
            createdBy: {$not :{$eq:address}},
          }).sort({timestamp:1}).toArray();
    
          res.json({ staus: true, data: feed });
      }     

    } catch (error) {
      console.log(error);
    }   
}
