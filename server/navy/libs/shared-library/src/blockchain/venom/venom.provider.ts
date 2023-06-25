import { NftType } from "@app/shared-library/shared-library.main";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
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

    private static readonly AccountStorage = new SimpleAccountsStorage();
    private static readonly KeyStore = new SimpleKeystore();
    private static Provider: ProviderRpcClient;
    private static OwnerAccount: EverWalletAccount;

    private static CaptainsCollectionContract: Contract<typeof CollectionContractArtifact.ABI>;
    private static CaptainsMarketplaceContract: Contract<typeof MarketplaceContractArtifact.ABI>;

    constructor(private configService: ConfigService) {
        VenomProvider.Provider = new ProviderRpcClient({
            fallback: () =>
                EverscaleStandaloneClient.create({
                    connection: {
                        id: 0,
                        type: 'graphql',
                        data: {
                            endpoints: ['localhost'],
                        },
                    },
                    keystore: VenomProvider.KeyStore,
                    accountsStorage: VenomProvider.AccountStorage
                }),
        });
    }

    async init() {
        const publicKey = this.configService.get<string>('VENOM_OWNER_PUBLIC_KEY');
        const secretKey = this.configService.get<string>('VENOM_OWNER_SECRET_KEY');
        const collectionContractAddress = this.configService.get<string>('VENOM_COLLECTION_CONTRACT_ADDRESS');
        const marketplaceContractAddress = this.configService.get<string>('VENOM_MARKETPLACE_CONTRACT_ADDRESS');

        VenomProvider.OwnerAccount = await EverWalletAccount.fromPubkey({ publicKey, workchain: 0 });
        VenomProvider.AccountStorage.addAccount(VenomProvider.OwnerAccount);

        VenomProvider.KeyStore.addKeyPair('owner', {
            publicKey,
            secretKey
        });

        // Initialize contracts and setup event listeners
        VenomProvider.CaptainsCollectionContract = new VenomProvider.Provider.Contract(CollectionContractArtifact.ABI, new Address(collectionContractAddress));
        VenomProvider.CaptainsMarketplaceContract = new VenomProvider.Provider.Contract(MarketplaceContractArtifact.ABI, new Address(marketplaceContractAddress));
    }

    async getCaptainsTotalSupply() {
        const result: any = await VenomProvider.CaptainsCollectionContract.methods.totalSupply({ answerId: 0 } as never).call();
        return result.count;
    }

    async getCaptainsCollectionSize() {
        const result: any = await VenomProvider.CaptainsCollectionContract.methods.collectionSize({} as never).call();
        return result.collectionSize;
    }

    async initCallbacks(
        nftMintedCallback: Function,
        nftGeneratedCallback: Function,
        nftListedCallback: Function,
        nftDelistedCallback: Function,
        nftPriceSetCallback: Function,
        nftSoldCallback: Function
    ) {
        const captainsCollectionEvents = VenomProvider.CaptainsCollectionContract.events(new VenomProvider.Provider.Subscriber());
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
                        owner: contractEvent.data.owner,
                        nftAddress: contractEvent.data.nftAddress
                    });
                }
            }
        });

        const captainsMarketplaceEvents = VenomProvider.CaptainsMarketplaceContract.events(new VenomProvider.Provider.Subscriber());
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

    // Shit code, refactor it
    public static async GrantCaptain(id: number, json: string, minter: any) {
        try {
            Logger.log(`GrantCaptain: id: ${id}, json: ${json}, minter: ${minter}`);
            const tx = await VenomProvider.CaptainsCollectionContract.methods.generateNft({ id, json, minter } as never).send({
                from: VenomProvider.OwnerAccount.address,
                amount: "1000000000"
            });
        } catch (ex) {
            Logger.error(ex);
        }
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