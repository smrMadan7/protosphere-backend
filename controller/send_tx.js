
let constants = require('../config/constants');
let config = require('../config/environments/development');
const Web3 = require('web3');
const axios = require('axios');
const _db = require('../config/db');

let user = "user";
const provider = new Web3.providers.HttpProvider(
    config.HyperspaceRPC
);
 
const web3 = new Web3(provider);


// const provider = new Web3.providers.HttpProvider(
//   'https://polygon-testnet.public.blastapi.io	'
// );
// const web3 = new Web3(provider);

const AUTH_ADDRESS = '0xB771e43C55444015A798BD5d873B1B14ebda6d7C';

async function sendTx() {

  let instance = new web3.eth.Contract(config.FilMasterABI, config.FilMasterAddress);
  // let instance = new web3.eth.Contract(config.FilMasterABI,'0xC4813c95f98eC788B9511F096d6CA3f83049BeF5');
  
  web3.eth.accounts.wallet.add(config.privateKey);


  console.log(`Initiated ...`);    
    let params = {
      handle: "gohan",
      user: "0xE838eAbe151251b8Ee6105c05f629526c9f49398",
      imageUrl: "Qmc7q2QLdi79i9wXPT2ZoiAkc7VhreMrbjv1vnXzsh6Hau",
      userData: "Qmc7q2QLdi79i9wXPT2ZoiAkc7VhreMrbjv1vnXzsh6Hau",
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
    return instance.methods.createMemberProfile(
      params.handle,params.user,params.imageUrl,params.userData
    ).send({
      nonce: web3.utils.toHex(txCount),
      from: AUTH_ADDRESS,
      to: config.FilMasterAddress,
      gas: 800000,//estimatedGas, //gasLimit ? gasLimit : defaultGasLimit
      gasPrice: gasPrice,
      maxPriorityFeePerGas: 5 * 1e9,//priceParams.maxPriorityFeePerGas,
      maxFeePerGas: 5 * 1e9//priceParams.maxFeePerGas,
    }).then(function(receipt){
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
    return await instance.methods.createMemberProfile(
      params.handle,params.user,params.imageUrl,params.userData
    ).estimateGas({
      from: AUTH_ADDRESS,
    }, function (error, estimatedGas) {
      console.log('estimation', error, estimatedGas)
      if (!error) {
        return estimatedGas;
      }
    });
  }

  function send_token( ) {

    let contract_address = config.FilMasterAddress
    let send_token_amount,
    let to_address,
    let send_account,
    let private_key


    let wallet = new ethers.Wallet(private_key)
    let walletSigner = wallet.connect(window.ethersProvider)
  
    window.ethersProvider.getGasPrice().then((currentGasPrice) => {
      let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice))
      console.log(`gas_price: ${gas_price}`)
  
      if (contract_address) {
        // general token send
        let contract = new ethers.Contract(
          contract_address,
          send_abi,
          walletSigner
        )
  
        // How many tokens?
        let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18)
        console.log(`numberOfTokens: ${numberOfTokens}`)
  
        // Send tokens
        contract.transfer(to_address, numberOfTokens).then((transferResult) => {
          console.dir(transferResult)
          alert("sent token")
        })
      } // ether send
      else {
        const tx = {
          from: send_account,
          to: to_address,
          value: ethers.utils.parseEther(send_token_amount),
          nonce: window.ethersProvider.getTransactionCount(
            send_account,
            "latest"
          ),
          gasLimit: ethers.utils.hexlify(gas_limit), // 100000
          gasPrice: gas_price,
        }
        console.dir(tx)
        try {
          walletSigner.sendTransaction(tx).then((transaction) => {
            console.dir(transaction)
            alert("Send finished!")
          })
        } catch (error) {
          alert("failed to send!!")
        }
      }
    })
  }

  sendTx();
  