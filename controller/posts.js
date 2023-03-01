let constants = require('../config/constants');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');
const provider = new Web3.providers.HttpProvider(
    constants.HyperspaceRPC
);
let {User,Posts} = require('../config/collection');

const { create } = require('ipfs-http-client')
const ipfs = create(constants.ipfsURL) 


exports.createPost = async (req, res) => {
    try {
      let { profileId, address, postData } = req.body;
      if (!profileId || !address || !postData) {
        res.statusCode = 400;
        res.json({ staus: false, message: "Invalid params" });
      } else {
        // add txn and add post id
        let cid = await ipfs.add(Buffer.from(JSON.stringify(postData)));
        console.log(req.body, cid.path);
        await _db.get().collection(Posts).insertOne({
          profileId,
          createdBy: address,
          postURI: cid.path,
          timestamp: new Date().getTime(),
          likes:[]
        });
        res.json({ staus: true, message: "" });
      }
    } catch (error) {
      console.log(error);
    }   

}



exports.getPostsByAddress = async (req, res) => {
    try {
        let { address} = req.params;
    if(!address ){
        res.statusCode = 400;
        res.json({staus:false, message: 'Invalid params'});
    }else{
        let posts =  await _db.get().collection(Posts).find({    
            createdBy:address       
        }).sort({timestamp:-1}).toArray();
        res.json({staus:true, data: posts});
    }
    
    } catch (error) {
        console.log(error);
    }   

}

// TODO
exports.getPostById = async (req, res) => {
    try {
        let { profileId} = req.params;
    if(!address ){
        res.statusCode = 400;
        res.json({staus:false, message: 'Invalid params'});
    }else{
        let posts =  await _db.get().collection(Posts).find({    
            profileId:profileId       
        }).toArray();
        res.json({staus:true, data: posts});
    }
    
    } catch (error) {
        console.log(error);
    }   

}


// To implement Like
exports.like = async (req, res) => {

}
