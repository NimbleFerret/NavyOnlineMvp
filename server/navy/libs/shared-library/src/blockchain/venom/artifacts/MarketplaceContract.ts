export class MarketplaceContractArtifact {

    public static readonly ABI = {
        "ABI version": 2,
        "version": "2.2",
        "header": [
            "time"
        ],
        "functions": [
            {
                "name": "listNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "delistNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "buyNft",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "constructor",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "NFT_LISTED",
                "inputs": [],
                "outputs": [
                    {
                        "name": "NFT_LISTED",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "NFT_SOLD",
                "inputs": [],
                "outputs": [
                    {
                        "name": "NFT_SOLD",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "NFTListed",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NFTDelisted",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "NFTSold",
                "inputs": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "newOwner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
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
                "name": "NFT_LISTED",
                "type": "uint128"
            },
            {
                "name": "NFT_SOLD",
                "type": "uint128"
            },
            {
                "components": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "_nftsListedByAddress",
                "type": "map(address,tuple)"
            },
            {
                "components": [
                    {
                        "name": "nftAddress",
                        "type": "address"
                    },
                    {
                        "name": "seller",
                        "type": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint256"
                    }
                ],
                "name": "_nftsSoldByAddress",
                "type": "map(address,tuple)"
            }
        ]
    };

}