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
        private nftMintedCallback: Function,
        private nftGeneratedCallback: Function,
        private nftListedCallback: Function,
        private nftDelistedCallback: Function,
        private nftPriceSetCallback: Function,
        private nftSoldCallback: Function
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
        this.captainsMarketplaceContract = new this.provider.Contract(MarketplaceContractArtifact.ABI, new Address(VenomConstants.CaptainsMarketplaceContractAddress));

        const captainsCollectionEvents = this.captainsCollectionContract.events(new this.provider.Subscriber());
        captainsCollectionEvents.on(async (contractEvent: any) => {
            const eventName = 'Captains ' + contractEvent.event;
            if (contractEvent.event == VenomProvider.EventNftMinted) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    this.nftMintedCallback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            } else if (contractEvent.event == VenomProvider.EventNftGenerated) {
                if (this.checkEventEmitted(contractEvent, eventName)) {
                    this.nftGeneratedCallback({
                        nftType: NftType.CAPTAIN,
                        id: contractEvent.data.id,
                        owner: contractEvent.data.owner
                    });
                }
            }
        });

        const captainsMarketplaceEvents = this.captainsMarketplaceContract.events(new this.provider.Subscriber());
        captainsMarketplaceEvents.on(async (contractEvent: any) => {
            const eventName = 'Captains ' + contractEvent.event;
            switch (contractEvent.event) {
                case VenomProvider.EventNftListed:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        this.nftListedCallback();
                    }
                    break;
                case VenomProvider.EventNftDelisted:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        this.nftDelistedCallback();
                    }
                    break;
                case VenomProvider.EventNftSalePriceSet:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        this.nftPriceSetCallback();
                    }
                    break;
                case VenomProvider.EventNftSold:
                    if (this.checkEventEmitted(contractEvent, eventName)) {
                        this.nftSoldCallback();
                    }
                    break;
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