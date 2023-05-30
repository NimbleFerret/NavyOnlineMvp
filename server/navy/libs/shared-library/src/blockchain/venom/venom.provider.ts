import { NftType } from "@app/shared-library/shared-library.main";
import { Logger } from "@nestjs/common";
import { Address, Contract, ProviderRpcClient } from "everscale-inpage-provider";
import {
    EverscaleStandaloneClient,
    EverWalletAccount,
    SimpleAccountsStorage,
    SimpleKeystore
} from "everscale-standalone-client/nodejs";
import { CollectionContractArtifact } from "./artifacts/CollectionContract";
import { MarketplaceContractArtifact } from "./artifacts/MarketplaceContract";
import { VenomConstants } from "./venom.constants";

export class VenomProvider {

    public static readonly EventNftMinted = 'NftMinted';
    public static readonly EventNftGenerated = 'NftGenerated';
    public static readonly EventNftListed = 'NftListed';
    public static readonly EventNftDelisted = 'NftDelisted';
    public static readonly EventNftSold = 'NftSold';
    public static readonly EventNftSalePriceSet = 'NftSalePriceSet';

    private static readonly Provider: ProviderRpcClient;

    // private static readonly Provider = new ProviderRpcClient({
    //     fallback: () =>
    //         EverscaleStandaloneClient.create({
    //             connection: {
    //                 id: 0,
    //                 group: "Local Node (GQL)",
    //                 type: "graphql",
    //                 data: {
    //                     endpoints: ["localhost"],
    //                 },
    //             }
    //         }),
    // });

    private static readonly AccountStorage = new SimpleAccountsStorage();
    private static readonly KeyStore = new SimpleKeystore();

    private captainsCollectionContract: Contract<typeof CollectionContractArtifact.ABI>;
    private captainsMarketplaceContract: Contract<typeof MarketplaceContractArtifact.ABI>;


    private ownerAccount: EverWalletAccount;

    // constructor() {
    // Not a static test
    // const accountStorage = new SimpleAccountsStorage();
    // const keyStore = new SimpleKeystore();

    // const provider = new ProviderRpcClient({
    //     fallback: () =>
    //         EverscaleStandaloneClient.create({
    //             connection: {
    //                 id: 0,
    //                 group: "Local Node (GQL)",
    //                 type: "graphql",
    //                 data: {
    //                     endpoints: ["localhost"],
    //                 },
    //             },
    //             keystore: keyStore,
    //             accountsStorage: accountStorage
    //         }),
    // });
    // }

    async initContracts(
        contractsOwnerPublicKey: string,
        contractsOwnerSecretKey: string,
        nftMintedCallback: Function,
        nftGeneratedCallback: Function,
        nftListedCallback: Function,
        nftDelistedCallback: Function,
        nftPriceSetCallback: Function,
        nftSoldCallback: Function
    ) {
        const publicKey = contractsOwnerPublicKey;
        const secretKey = contractsOwnerSecretKey;

        this.ownerAccount = await EverWalletAccount.fromPubkey({ publicKey, workchain: 0 });
        VenomProvider.AccountStorage.addAccount(this.ownerAccount);

        VenomProvider.KeyStore.addKeyPair('owner', {
            publicKey,
            secretKey
        });

        // Initialize contracts and setup event listeners
        this.captainsCollectionContract = new VenomProvider.Provider.Contract(CollectionContractArtifact.ABI, new Address(VenomConstants.CaptainsCollectionContractAddress));
        this.captainsMarketplaceContract = new VenomProvider.Provider.Contract(MarketplaceContractArtifact.ABI, new Address(VenomConstants.CaptainsMarketplaceContractAddress));

        const captainsCollectionEvents = this.captainsCollectionContract.events(new VenomProvider.Provider.Subscriber());
        captainsCollectionEvents.on(async (contractEvent: any) => {
            const eventName = 'Captains ' + contractEvent.event;
            if (contractEvent.event == VenomProvider.EventNftMinted) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    nftMintedCallback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            } else if (contractEvent.event == VenomProvider.EventNftGenerated) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    nftGeneratedCallback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            }
        });

        const captainsMarketplaceEvents = this.captainsMarketplaceContract.events(new VenomProvider.Provider.Subscriber());
        captainsMarketplaceEvents.on(async (contractEvent: any) => {
            const eventName = 'Captains ' + contractEvent.event;
            switch (contractEvent.event) {
                case VenomProvider.EventNftListed:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        nftListedCallback();
                    }
                    break;
                case VenomProvider.EventNftDelisted:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        nftDelistedCallback();
                    }
                    break;
                case VenomProvider.EventNftSalePriceSet:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        nftPriceSetCallback();
                    }
                    break;
                case VenomProvider.EventNftSold:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        nftSoldCallback();
                    }
                    break;
            }
        });

    }

    public static async VerifySignature(messageToSign: string, publicKey: string, dataHash: string, signature: string) {
        let result = false;

        const backEndSignature = await VenomProvider.Provider.signData({
            data: Buffer.from(messageToSign).toString('base64'),
            publicKey: publicKey
        });

        if (signature == backEndSignature.signature) {
            result = (await VenomProvider.Provider.verifySignature({
                publicKey,
                dataHash,
                signature
            })).isValid;
        }

        return result;
    }

    private checkEventEmitted(contractEvent: any, eventName: string) {
        let success = true;
        try {
            if (contractEvent.transaction.aborted) {
                success = false;
                Logger.error(`Event '${eventName}' check failed. Transaction aborted.`);
            }
        } catch (ex) {
            Logger.error(ex);
        } finally {
            return success;
        }
    }

}