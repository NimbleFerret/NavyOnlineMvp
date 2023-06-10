
export class CollectionContractArtifact {

    public static readonly ABI = {
        "ABI version": 2,
        "version": "2.2",
        "header": [
            "time"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "_mintPrice",
                        "type": "uint128"
                    },
                    {
                        "name": "_collectionSize",
                        "type": "uint128"
                    },
                    {
                        "name": "codeNft",
                        "type": "cell"
                    },
                    {
                        "name": "json",
                        "type": "string"
                    },
                    {
                        "name": "codeIndex",
                        "type": "cell"
                    },
                    {
                        "name": "codeIndexBasis",
                        "type": "cell"
                    },
                    {
                        "name": "ownerAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "mintNft",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "generateNft",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "json",
                        "type": "string"
                    },
                    {
                        "name": "minter",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeMintState",
                "inputs": [
                    {
                        "name": "_mintState",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "addToWhitelist",
                "inputs": [
                    {
                        "name": "toAddAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "removeFromWhitelist",
                "inputs": [
                    {
                        "name": "toRemoveAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "owner",
                "inputs": [],
                "outputs": [
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "transferOwnership",
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "indexBasisCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "indexBasisCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "hash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "resolveIndexBasis",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "indexBasis",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "indexCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "indexCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "hash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "getJson",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "json",
                        "type": "string"
                    }
                ]
            },
            {
                "name": "totalSupply",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "count",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "nftCode",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "code",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "nftCodeHash",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "codeHash",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "nftAddress",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    },
                    {
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "nft",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "supportsInterface",
                "inputs": [
                    {
                        "name": "answerId",
                        "type": "uint32"
                    },
                    {
                        "name": "interfaceID",
                        "type": "uint32"
                    }
                ],
                "outputs": [
                    {
                        "name": "value0",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "mintPrice",
                "inputs": [],
                "outputs": [
                    {
                        "name": "mintPrice",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "mintState",
                "inputs": [],
                "outputs": [
                    {
                        "name": "mintState",
                        "type": "uint8"
                    }
                ]
            },
            {
                "name": "whitelist",
                "inputs": [],
                "outputs": [
                    {
                        "name": "whitelist",
                        "type": "map(address,bool)"
                    }
                ]
            },
            {
                "name": "collectionSize",
                "inputs": [],
                "outputs": [
                    {
                        "name": "collectionSize",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "NftMinted",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftGenerated",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "OwnershipTransferred",
                "inputs": [
                    {
                        "name": "oldOwner",
                        "type": "address"
                    },
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftCreated",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "nft",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "manager",
                        "type": "address"
                    },
                    {
                        "name": "creator",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NftBurned",
                "inputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "nft",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "manager",
                        "type": "address"
                    }
                ],
                "outputs": []
            }
        ],
        "fields": [
            {
                "name": "_pubkey",
                "type": "uint256"
            },
            {
                "name": "_timestamp",
                "type": "uint64"
            },
            {
                "name": "_constructorFlag",
                "type": "bool"
            },
            {
                "name": "_supportedInterfaces",
                "type": "optional(cell)"
            },
            {
                "name": "_codeNft",
                "type": "cell"
            },
            {
                "name": "_totalSupply",
                "type": "uint128"
            },
            {
                "name": "_json",
                "type": "string"
            },
            {
                "name": "_codeIndex",
                "type": "cell"
            },
            {
                "name": "_codeIndexBasis",
                "type": "cell"
            },
            {
                "name": "_indexDeployValue",
                "type": "uint128"
            },
            {
                "name": "_indexDestroyValue",
                "type": "uint128"
            },
            {
                "name": "_deployIndexBasisValue",
                "type": "uint128"
            },
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "mintPrice",
                "type": "uint128"
            },
            {
                "name": "mintState",
                "type": "uint8"
            },
            {
                "name": "whitelist",
                "type": "map(address,bool)"
            },
            {
                "name": "collectionSize",
                "type": "uint128"
            }
        ]
    };

}