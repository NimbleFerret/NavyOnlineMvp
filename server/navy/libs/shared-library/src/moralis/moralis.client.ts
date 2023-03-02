import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";

export class MoralisClient {

    private readonly chain = EvmChain.CRONOS_TESTNET;
    private readonly apiKey = "aQrAItXuznpPv1pEXAgPIIwcVqwaehaPHpB9WmGo0eP1dGUdmzyt5SYfmstQslBF";

    async init() {
        await Moralis.start({
            apiKey: this.apiKey
        });
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
}