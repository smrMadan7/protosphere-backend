let constants = require('../config/constants');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');

let { User, Posts } = require('../config/collection');
const provider = new Web3.providers.HttpProvider(
  constants.value.HyperspaceRPC
);

const web3 = new Web3(provider);

const { create } = require('ipfs-http-client')
const ipfs = create(constants.ipfsURL)
exports.verify = async (req, res) => {
  let signatureHex = req.body.signature;
  let address = req.body.address;
  let message = req.body.message;
  console.log(req.body);
  try {
    if (!signatureHex || !address || !message) {
      res.json({ status: false, message: 'Invalid params' })
    } else {
      let recoveredAddress = web3.eth.accounts.recover(message, signatureHex);
      if (recoveredAddress.toUpperCase() === address.toUpperCase()) { //verified
        let profile = await _db.get().collection(User).findOne({ address: address });
        console.log(profile);
        if (profile) {
          delete profile['id'];
          res.json({
            status: true,
            data: profile,
          });
        } else {
          res.json({
            status: true,
            data: null,
          });
        }


      } else { //failed
        res.json({
          status: false,
          message: 'Signature mismatch!'
        });
      }
    }
  } catch (error) {
    console.log(error);
  }

}


exports.checkHandle = async (req, res) => {
  try {
    let handle = req.params.handle;
    if (!handle) {
      res.json({ status: false, message: "" });
    } else {
      let availability = await _db
        .get()
        .collection(User)
        .findOne({ handle: handle });

      if (!availability) {
        res.json({
          status: true,
          message: "user handle available",
        });
      } else {
        res.json({
          status: false,
          message: "user handle is taken already!",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};


exports.registerMember = async (req, res) => {
  try {
    let {
      firstName,
      lastName,
      handle,
      profilePictureUrl,
      displayName,
      bio,
      role,
      organization,
      skill,
      openForWork,
      address
    } = req.body;
    if (!firstName || !lastName || !handle || !profilePictureUrl || !displayName || !bio || !role || !organization || !skill || !openForWork || !address) {
      res.json({ status: false, message: "Invalid params!", statusCode: 400 });
    } else {
      // ipfs.add()
      let profile = await _db.get().collection(User).findOne({ address: address })
      console.log(profile);
      if (profile) {
        res.json({ status: false, message: "Profile exists!" });
      } else {
        let cid = await ipfs.add(Buffer.from(JSON.stringify(req.body)))
        console.log(cid);
        req.body['type'] = 'member';
        req.body['ipfs'] = cid.path;

        let params = {
          handle,
          user: address,
          imageUrl: profilePictureUrl,
          userData: cid.path
        }

        let NFT = await createMemberNFT(params);
        console.log(NFT);
        console.log(typeof(NFT));
        if (NFT) {
          await _db.get().collection(User).insertOne(req.body);
          res.json({ status: true, data: req.body, message: "" });
        } else {
          res.json({ status: false, message: "Error creating profile" });

        }
        }


    }

  } catch (error) {
    console.log(error);
    res.json({ status: false, message: "Error creating profile" });

  }

}


async function createTeamNFT(params) {
  console.log(constants.value.FilMasterAddress);
  let instance = new web3.eth.Contract(
    constants.value.FilMasterABI,
    constants.value.FilMasterAddress
  );
  // let instance = new web3.eth.Contract(config.FilMasterABI,'0xC4813c95f98eC788B9511F096d6CA3f83049BeF5');

  web3.eth.accounts.wallet.add(constants.value.privateKey);


  console.log(`Initiated ...`);

  // const priceParams = await getPriceParamsForTransaction('init', 0);
  let estimatedGas = await instance.methods
  .createTeamProfile(
    params.handle,
    params.user,
    params.imageUrl,
    params.userData
  )
  .estimateGas(
    {
      from: constants.value.AUTH_ADDRESS,
    },
    function (error, estimatedGas) {
      console.log("estimation", error, estimatedGas);
      if (!error) {
        return estimatedGas;
      }
    }
  );

  console.log(`Estimate Gas Limit value: ${estimatedGas}`);
  estimatedGas += 50000;
  console.log(`Added 50000 to Estimate Gas Limit value, new value will be: ${estimatedGas}`);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const txCount = await web3.eth.getTransactionCount(constants.value.AUTH_ADDRESS, "pending");
  console.log("txCount: ", txCount);
  let gasPrice = await web3.eth.getGasPrice();
  gasPrice = gasPrice * 1 + (gasPrice * 50) / 100;
  gasPrice = Math.ceil(gasPrice);
  let tx = await instance.methods
    .createTeamProfile(
      params.handle,
      params.user,
      params.imageUrl,
      params.userData
    )
    .send({
      nonce: web3.utils.toHex(txCount),
      from: constants.value.AUTH_ADDRESS,
      to: constants.value.FilMasterAddress,
      gas: estimatedGas, //gasLimit ? gasLimit : defaultGasLimit
      gasPrice: gasPrice,
      maxPriorityFeePerGas: 5 * 1e9,
      maxFeePerGas: 5 * 1e9,
    })
    .then(function (receipt) {
      console.log(receipt);
      return receipt
    });

    console.log('tx',tx);
    return tx.status
  // .on('transactionHash', function (transactionHash) {
  //   console.log(`Transaction Hash: ${transactionHash} for address: ${address}\n`);
  // })
  // .on('receipt', async function (receipt) {
  //   console.log(`On Receipt, Transaction Hash: ${receipt.transactionHash} for address: ${address}\n`);
  //   console.log('Status: ', receipt.status);

  //   return { error: null, transactionHash: receipt.transactionHash };
  // })
  // .on('error', function (error) {
  //   console.log('error');
  //   console.log(error);
  //   return { error: error, transactionHash: null };
  // })
}


exports.registerTeam = async (req, res) => {
 try {
  let {
    organizationName,
    desc,
    handle,
    profilePictureUrl,
    website,
    contact,
    social,
    address
  } = req.body;
  console.log(req.body);

  if (!organizationName || !desc || !handle || !profilePictureUrl || !website || !contact || !social || !address) {
    res.json({ status: false, message: "Invalid params!", statusCode: 400 });
  } else {
    let profile = await _db.get().collection(User).findOne({ address: address })

    if (profile) {
      res.json({ status: false, message: "Profile exists!" });
    } else {
      let cid = await ipfs.add(Buffer.from(JSON.stringify(req.body)))
      console.log(cid);
      req.body['ipfs'] = cid.path;
      req.body['type'] = 'team';
      let params = {
        handle,
        user: address,
        imageUrl: profilePictureUrl,
        userData: cid.path
      }
      let NFT = await createTeamNFT(params);
      console.log(NFT);
      console.log(typeof(NFT));
      if (NFT) {
        await _db.get().collection(User).insertOne(req.body);
        res.json({ status: true, data: req.body, message: "" });
      } else {
        res.json({ status: false, message: "Error creating profile" });

      }


    }


  }
 } catch (error) {
  console.log(error);
  res.json({ status: false, message: "Error creating profile" });
  
 }

}


  async function createMemberNFT(params) {
    let instance = new web3.eth.Contract(
      constants.value.FilMasterABI,
      constants.value.FilMasterAddress
    );
    // let instance = new web3.eth.Contract(config.FilMasterABI,'0xC4813c95f98eC788B9511F096d6CA3f83049BeF5');

    web3.eth.accounts.wallet.add(constants.value.privateKey);


    console.log(`Initiated ...`);

    // const priceParams = await getPriceParamsForTransaction('init', 0);
    let estimatedGas = await getEstimateGas(instance, params);

    console.log(`Estimate Gas Limit value: ${estimatedGas}`);
    estimatedGas += 50000;
    console.log(`Added 50000 to Estimate Gas Limit value, new value will be: ${estimatedGas}`);

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const txCount = await web3.eth.getTransactionCount(constants.value.AUTH_ADDRESS, "pending");
    console.log("txCount: ", txCount);
    let gasPrice = await web3.eth.getGasPrice();
    gasPrice = gasPrice * 1 + (gasPrice * 50) / 100;
    gasPrice = Math.ceil(gasPrice);
    let tx = await instance.methods
      .createMemberProfile(
        params.handle,
        params.user,
        params.imageUrl,
        params.userData
      )
      .send({
        nonce: web3.utils.toHex(txCount),
        from: constants.value.AUTH_ADDRESS,
        to: constants.value.FilMasterAddress,
        gas: estimatedGas, //gasLimit ? gasLimit : defaultGasLimit
        gasPrice: gasPrice,
        maxPriorityFeePerGas: 5 * 1e9,
        maxFeePerGas: 5 * 1e9,
      })
      .then(function (receipt) {
        console.log(receipt);
        return receipt
      });

      return tx.status
    // .on('transactionHash', function (transactionHash) {
    //   console.log(`Transaction Hash: ${transactionHash} for address: ${address}\n`);
    // })
    // .on('receipt', async function (receipt) {
    //   console.log(`On Receipt, Transaction Hash: ${receipt.transactionHash} for address: ${address}\n`);
    //   console.log('Status: ', receipt.status);

    //   return { error: null, transactionHash: receipt.transactionHash };
    // })
    // .on('error', function (error) {
    //   console.log('error');
    //   console.log(error);
    //   return { error: error, transactionHash: null };
    // })
  }

  const getEstimateGas = async (instance, params) => {
    return await instance.methods
      .createMemberProfile(
        params.handle,
        params.user,
        params.imageUrl,
        params.userData
      )
      .estimateGas(
        {
          from: constants.value.AUTH_ADDRESS,
        },
        function (error, estimatedGas) {
          console.log("estimation", error, estimatedGas);
          if (!error) {
            return estimatedGas;
          }
        }
      );
  };




 

  exports.getProfile = async (req, res) => {
    try {
      let address = req.params.address;


      if (!address) {
        res.json({ status: false, message: "Invalid params!", statusCode: 400 });
      } else {
        console.log(address);

        let profile = await _db.get().collection(User).findOne({ address: address })
        if (profile) {
          delete profile['_id']
          res.json({ status: true, data: profile, message: "" });
        } else {
          res.json({ status: false, message: "No profile found for the wallet!" });
        }

      }
    } catch (error) {
      console.log(error);
      res.json({ status: false, message: "Something went wrong!" });

    }


  }



  exports.editProfile = async (req, res) => {
    let address = req.params.address;


    if (!address) {
      res.json({ status: false, message: "Invalid params!", statusCode: 400 });
    } else {
      console.log(address);

      let profile = await _db.get().collection(User).findOne({ address: address })
      if (profile) {
        delete profile['_id']
        res.json({ status: true, data: profile, message: "" });
      } else {
        res.json({ status: false, message: "No profile found for the wallet!" });
      }

    }


  }


  exports.getProfiles = async (req, res) => {
    try {
      let address = req.body.address;
      console.log(address.length);
      if (!address || address.length < 1) {
        res.json({ status: false, message: "Invalid params!", statusCode: 400 });
      } else {
        console.log(address);

        let profile = await _db
          .get()
          .collection(User)
          .find({ address: { $in: address } }, { _id: 0 })
          .toArray();
        if (profile) {
          res.json({ status: true, data: profile, message: "" });
        } else {
          res.json({ status: false, message: "No profile found for the wallet!" });
        }
      }
    } catch (error) {
      console.log(error);
      res.json({ status: false, message: "Something went wrong!" });

    }
  };



  exports.getAllProfiles = async (req, res) => {
    try {

      let profile = await _db
        .get()
        .collection(User)
        .find({}, { _id: 0 })
        .toArray();
      if (profile) {
        res.json({ status: true, data: profile, message: "" });
      } else {
        res.json({ status: false, message: "No profile found!" });
      }

    } catch (error) {
      console.log(error);
      res.json({ status: false, message: "Something went wrong!" });

    }
  };

