/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';

import Moralis from "moralis-v1/node";

@Injectable()
export class MoralisService implements OnModuleInit {

    // TODO move to env file
    private readonly serverUrl = "";
    private readonly appId = "";
    private readonly masterKey = "";

    async onModuleInit() {
        // await Moralis.start({
        //     serverUrl: this.serverUrl,
        //     appId: this.appId,
        //     masterKey: this.masterKey
        // });
        // await Moralis.Cloud.run("printLogs");
    }

}
