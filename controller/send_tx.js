let constants = require("../config/constants");
let config = require("../config/environments/development");
const Web3 = require("web3");
const axios = require("axios");
const _db = require("../config/db");
const solc = require('solc');

let user = "user";
const provider = new Web3.providers.HttpProvider(config.HyperspaceRPC);

const web3 = new Web3(provider);

// const provider = new Web3.providers.HttpProvider(
//   'https://polygon-testnet.public.blastapi.io	'
// );
// const web3 = new Web3(provider);

const AUTH_ADDRESS = "0xB771e43C55444015A798BD5d873B1B14ebda6d7C";

async function sendTx() {
  let instance = new web3.eth.Contract(
    config.FilMasterABI,
    config.FilMasterAddress
  );
  // let instance = new web3.eth.Contract(config.FilMasterABI,'0xC4813c95f98eC788B9511F096d6CA3f83049BeF5');

  web3.eth.accounts.wallet.add(config.privateKey);


  console.log(`Initiated ...`);
  let params = {
    handle: "PLN",
    user: "0x6984fd953DF1574686BF4Bf733e1dc5D9A575327",
    imageUrl: "QmdDEsGEf41iKdpynUm55SMtYxwWdrdoxC5wGgTvysHGqC",
    userData: "QmfCn5ewLSprdU66oJZsxaXXrQBdMZXPDW4sFAqgt3zuCB",
  };
  // const priceParams = await getPriceParamsForTransaction('init', 0);
  // let estimatedGas = await getEstimateGas(instance,params);

  // console.log(`Estimate Gas Limit value: ${estimatedGas}`);
  // estimatedGas += 50000;
  // console.log(`Added 50000 to Estimate Gas Limit value, new value will be: ${estimatedGas}`);

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const txCount = await web3.eth.getTransactionCount(AUTH_ADDRESS, "pending"); //, "pending");
  console.log("txCount: ", txCount);
  let gasPrice = await web3.eth.getGasPrice();
  gasPrice = gasPrice * 1 + (gasPrice * 50) / 100;
  gasPrice = Math.ceil(gasPrice);
  return instance.methods
    .createMemberProfile(
      params.handle,
      params.user,
      params.imageUrl,
      params.userData
    )
    .send({
      nonce: web3.utils.toHex(txCount),
      from: AUTH_ADDRESS,
      to: config.FilMasterAddress,
      gas: 8000000, //estimatedGas, //gasLimit ? gasLimit : defaultGasLimit
      gasPrice: gasPrice,
      maxPriorityFeePerGas: 5 * 1e9, //priceParams.maxPriorityFeePerGas,
      maxFeePerGas: 5 * 1e9, //priceParams.maxFeePerGas,
    })
    .then(function (receipt) {
      console.log(receipt);
    });
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
        from: AUTH_ADDRESS,
      },
      function (error, estimatedGas) {
        console.log("estimation", error, estimatedGas);
        if (!error) {
          return estimatedGas;
        }
      }
    );
};

function send_token() {
  const account_from = {
    privateKey: config.privateKey,
  };
  const contractAddress = config.FilMasterAddress;
  let params = {
    handle: "PLN",
    user: "0x6984fd953DF1574686BF4Bf733e1dc5D9A575327",
    imageUrl: "QmdDEsGEf41iKdpynUm55SMtYxwWdrdoxC5wGgTvysHGqC",
    userData: "QmfCn5ewLSprdU66oJZsxaXXrQBdMZXPDW4sFAqgt3zuCB",
  };
  const ethers = require('ethers');

// 2. Define network configurations
const providerRPC = {
  fil: {
    name: 'Filecoin - Hyperspace testnet',
    rpc: 'https://rpc.ankr.com/filecoin_testnet', 
    chainId: 3141, 
  },
};

const provider = new ethers.providers.JsonRpcProvider(
  providerRPC.fil.rpc, 
  {
    chainId: providerRPC.fil.chainId,
    name: providerRPC.fil.name,
  }
);

  let wallet = new ethers.Wallet(account_from.privateKey, provider);
  // let abi = new ethers.utils.Interface( config.FilMasterABI )
  // console.log(abi);
  const contract = new ethers.Contract(
    config.FilMasterAddress,
    config.FilMasterABI,
    wallet
  );
  const increment = async () => {
    
    const unsignedTrx = await contract.createMemberProfile(params.handle,params.user,params.imageUrl,params.userData);
    unsignedTrx['gasLimit'] = provider.estimateGas(unsignedTrx);
    unsignedTrx['gasPrice'] = ethers.utils.parseUnits("5", "gwei");
    const trxResponse = await wallet.sendTransaction(unsignedTrx);
      let res =  new Promise(async(resolve, reject) => {
        const trxResponse = await wallet.sendTransaction(unsignedTrx);
        resolve(trxResponse);
        console.log(res);
      })

      

    console.log(`Tx successful with hash: ${trxResponse}`);
  };

  increment();
}

send_token();
// sendTx();
