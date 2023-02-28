module.exports =  Object.freeze({
    PORT: 3000,    

    //DB
    DBNAME: "filster-dev",
    MONGODBURL : "mongodb://localhost:27017",
    HyperspaceRPC : "https://api.hyperspace.node.glif.io/rpc/v1",
    ipfsURL:"http://localhost:8080",
    FilMasterAddress : "0x805612Bd2e7621B8a721Bec29D2bb24DAdd11Be6",
    FilMasterABI : [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_handle",
                    "type": "string"
                },
                {
                    "name": "_user",
                    "type": "address"
                },
                {
                    "name": "_imageURI",
                    "type": "string"
                },
                {
                    "name": "_userData",
                    "type": "string"
                }
            ],
            "name": "createMemberProfile",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_profileId",
                    "type": "uint256"
                },
                {
                    "name": "_postURI",
                    "type": "string"
                }
            ],
            "name": "createPost",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_handle",
                    "type": "string"
                },
                {
                    "name": "_user",
                    "type": "address"
                },
                {
                    "name": "_imageURI",
                    "type": "string"
                },
                {
                    "name": "_teamData",
                    "type": "string"
                }
            ],
            "name": "createTeamProfile",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "userAddress",
                    "type": "address"
                },
                {
                    "name": "functionSignature",
                    "type": "bytes"
                },
                {
                    "name": "sigR",
                    "type": "bytes32"
                },
                {
                    "name": "sigS",
                    "type": "bytes32"
                },
                {
                    "name": "sigV",
                    "type": "uint8"
                }
            ],
            "name": "executeMetaTransaction",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes"
                }
            ],
            "payable": true,
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_profileId",
                    "type": "uint256"
                },
                {
                    "name": "_postId",
                    "type": "uint256"
                },
                {
                    "name": "_postURI",
                    "type": "string"
                }
            ],
            "name": "modifyPost",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "profileCreator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "whitelist",
                    "type": "bool"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "ProfileCreatorWhitelisted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "profileId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "MemberProfileCreated",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [],
            "name": "renounceOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newState",
                    "type": "uint8"
                }
            ],
            "name": "setState",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "profileId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "user",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "TeamProfileCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "profileId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "name": "postId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "postURI",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "Post",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "profileId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "name": "postId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "name": "postURI",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "PostModified",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "userAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "relayerAddress",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "functionSignature",
                    "type": "bytes"
                }
            ],
            "name": "MetaTransactionExecuted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "name": "caller",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "state",
                    "type": "uint8"
                },
                {
                    "indexed": false,
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "State",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "previousOwner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "OwnershipTransferred",
            "type": "event"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "newOwner",
                    "type": "address"
                }
            ],
            "name": "transferOwnership",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "profileCreator",
                    "type": "address"
                },
                {
                    "name": "whitelist",
                    "type": "bool"
                }
            ],
            "name": "whitelistProfileCreator",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "_memberProfileById",
            "outputs": [
                {
                    "name": "user",
                    "type": "address"
                },
                {
                    "name": "postCount",
                    "type": "uint128"
                },
                {
                    "name": "handle",
                    "type": "string"
                },
                {
                    "name": "imageURI",
                    "type": "string"
                },
                {
                    "name": "userData",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                },
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "_postByIDs",
            "outputs": [
                {
                    "name": "profileId",
                    "type": "uint256"
                },
                {
                    "name": "postId",
                    "type": "uint256"
                },
                {
                    "name": "postURI",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "_teamProfileById",
            "outputs": [
                {
                    "name": "user",
                    "type": "address"
                },
                {
                    "name": "postCount",
                    "type": "uint128"
                },
                {
                    "name": "handle",
                    "type": "string"
                },
                {
                    "name": "imageURI",
                    "type": "string"
                },
                {
                    "name": "teamData",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "ERC712_VERSION",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getChainId",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getDomainSeperator",
            "outputs": [
                {
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "user",
                    "type": "address"
                }
            ],
            "name": "getNonce",
            "outputs": [
                {
                    "name": "nonce",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "getState",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "isOwner",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "name": "",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

})