import { AttachOperation } from "@app/shared-library/gprc/grpc.user.service";

export class AuthUpdateDto {
    operation: AttachOperation;
    email: string;
    ethAddress: string;
    signedMessage: string;
}

export class WorldMoveDto {
    user: string;
    x: number;
    y: number;
}

export class WorldEnterDto {
    user: string;
    region: string;
}

export class StartMiningDto {
    user: string;
    islandId: string;
}