/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';

import Moralis from "moralis";

@Injectable()
export class MoralisService implements OnModuleInit {

    // TODO move to env file
    // private readonly serverUrl = "";
    // private readonly appId = "";
    // private readonly masterKey = "";
    private readonly apiKey = "";

    async onModuleInit() {
        await Moralis.start({
            apiKey: this.apiKey
        });
    }

    async uploadFile(path: string, content: string) {
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
