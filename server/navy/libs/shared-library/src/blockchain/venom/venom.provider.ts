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

    private captainsCollectionContract: Contract<typeof CollectionContractArtifact.ABI>;
    private captainsMarketplaceContract: Contract<typeof MarketplaceContractArtifact.ABI>;

    private readonly accountStorage = new SimpleAccountsStorage();
    private readonly keyStore = new SimpleKeystore();
    private readonly provider: ProviderRpcClient;
    private ownerAccount: EverWalletAccount;

    constructor(
        private nftMintedCalback: Function,
        private nftGeneratedCalback: Function,
        private nftListedCallback: Function,
        private nftDelistedCalback: Function,
        private nftPriceSetCalback: Function,
        private nftSoldCalback: Function
    ) {
        this.provider = new ProviderRpcClient({
            fallback: () =>
                EverscaleStandaloneClient.create({
                    connection: {
                        id: 0,
                        type: 'graphql',
                        data: {
                            endpoints: ['localhost'],
                        },
                    },
                    keystore: this.keyStore,
                    accountsStorage: this.accountStorage
                }),
        });
    }

    async init(contractsOwnerPublicKey: string, contractsOwnerSecretKey: string) {
        const publicKey = contractsOwnerPublicKey;
        const secretKey = contractsOwnerSecretKey;

        this.ownerAccount = await EverWalletAccount.fromPubkey({ publicKey, workchain: 0 });
        this.accountStorage.addAccount(this.ownerAccount);

        this.keyStore.addKeyPair('owner', {
            publicKey,
            secretKey
        });

        // Initialize contracts and setup event listeners
        this.captainsCollectionContract = new this.provider.Contract(CollectionContractArtifact.ABI, new Address(VenomConstants.CaptainsCollectionContractAddress));

        const captainsContractEvents = this.captainsCollectionContract.events(new this.provider.Subscriber());
        captainsContractEvents.on(async (contractEvent: any) => {
            const eventName = 'Captains ' + contractEvent.event;
            if (contractEvent.event == this.COLLECTION_EVENT_NFT_MINTED) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    this.nftMintedCalback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            } else if (contractEvent.event == this.COLLECTION_EVENT_NFT_GENERATED) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    this.nftGeneratedCalback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            }
        });
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