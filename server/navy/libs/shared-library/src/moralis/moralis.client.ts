import Moralis from "moralis";

export class MoralisClient {

    private static instance: MoralisClient

    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    private constructor() { }

    public static getInstance(): MoralisClient {
        if (!MoralisClient.instance) {
            MoralisClient.instance = new MoralisClient();
            MoralisClient.instance.init().then();
        }
        return MoralisClient.instance;
    }

    public async uploadFile(path: string, content: string) {
        const abi = [
            {
                path,
                content
            }
        ];
        return await Moralis.EvmApi.ipfs.uploadFolder({
            abi
        });
    }

    private async init() {
        await Moralis.start({
            apiKey: this.apiKey
        });
    }
}