const _db = require('../config/db');
let { User, Notifications } = require('../config/collection');
let constants = require('../config/constants');
const Web3 = require('web3');
const provider = new Web3.providers.HttpProvider(
    constants.value.HyperspaceRPC
);

const web3 = new Web3(provider);

const { create } = require('ipfs-http-client')
const ipfs = create(constants.ipfsURL)

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('establishConnection', (params) => {
            socket.join(params.address)
            //   cb()
        })

        socket.on('sendNotifications', async (request) => {
            console.log(request);
            request['timestamp'] = new Date().getTime();
            await _db.get().collection(Notifications).insertOne({
                timestamp: new Date().getTime(),
                type: request.type,
                performedBy: request.performedBy,
                subjectId: request.subjectId,
                details: request.details,
                state: 0
            });

            io.to(request.subjectId).emit('receiveNotifications', request)
        })

        socket.on('createProfile', async (request) => {
            console.log(request);
            let profile;
            if (request.type == 'member') {
                profile = await createMemberProfile(request);
            } else if (request.type == 'team') {
                profile = await createTeamProfile(request);
            }
            console.log('Profile created',profile);

            io.to(request.address).emit('profile', profile);
        })
    })
}



exports.getNotifications = async (req, res) => {
    try {
        let address = req.params.address;

        if (!address) {
            res.json({ status: false, message: "Invalid params!", statusCode: 400 });
        } else {
            console.log(address);

            let notifications = await _db.get().collection(Notifications).find({ subjectId: address }).sort({ timestamp: -1 });
            if (notifications) {
                res.json({ status: true, data: notifications });
            } else {
                res.json({ status: true, message: "No new notifications!" });
            }

        }
    } catch (error) {
        console.log(error);
        res.json({ status: false, message: "Something went wrong!" });

    }


}



async function createMemberProfile(params) {
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
        } = params;
        if (!firstName || !lastName || !handle || !profilePictureUrl || !displayName || !bio || !role || !organization || !skill || !openForWork || !address) {
            return({ status: false, message: "Invalid params!", statusCode: 400 });
        } else {
            // ipfs.add()
            let profile = await _db.get().collection(User).findOne({ address: address })
            // console.log(profile);
            if (profile) {
                //   res.json({ status: false, message: "Profile exists!" });
                return ({ status: false, message: "Profile exists!" });
            } else {
                let cid = await ipfs.add(Buffer.from(JSON.stringify(params)))
                console.log(cid);
                params['type'] = 'member';
                params['ipfs'] = cid.path;

                let ip = {
                    handle,
                    user: address,
                    imageUrl: profilePictureUrl,
                    userData: cid.path
                }

                let NFT = await createMemberNFT(ip);
                console.log(NFT);
                if (NFT) {
                    await _db.get().collection(User).insertOne(params);
                    // res.json({ status: true, data: params, message: "" });
                    return ({ status: true, data: params });
                } else {
                    //   res.json({ status: false, message: "Error creating profile" });
                    return ({ status: false, message: "Error creating profile" })
                }

            }


        }

    } catch (error) {
        console.log(error);
        return({ status: false, message: "Error creating profile" });

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

    console.log('tx', tx);
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


async function createTeamProfile(params) {

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
        } = params;
        console.log(params);

        if (!organizationName || !desc || !handle || !profilePictureUrl || !website || !contact || !social || !address) {
            //   res.json({ status: false, message: "Invalid params!", statusCode: 400 });
            return ({ status: false, message: "Invalid params!" });
        } else {
            let profile = await _db.get().collection(User).findOne({ address: address })

            if (profile) {
                // res.json({ status: false, message: "Profile exists!" });
                return ({ status: false, message: "Profile exists!" });
            } else {
                let cid = await ipfs.add(Buffer.from(JSON.stringify(params)))
                console.log(cid);
                params['ipfs'] = cid.path;
                params['type'] = 'team';
                let ip = {
                    handle,
                    user: address,
                    imageUrl: profilePictureUrl,
                    userData: cid.path
                }
                let NFT = await createTeamNFT(ip);
                console.log(NFT);
                console.log(typeof (NFT));
                if (NFT) {
                    await _db.get().collection(User).insertOne(params);
                    //   res.json({ status: true, data: params });
                    return ({ status: true, data: params });
                } else {
                    //   res.json({ status: false, message: "Error creating profile" });
                    return ({ status: false, message: "Error creating profile" });

                }

            }


        }
    } catch (error) {
        console.log(error);
        return ({ status: false, message: "Error creating profile" });

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



