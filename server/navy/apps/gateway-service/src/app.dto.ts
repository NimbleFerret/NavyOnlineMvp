export class SignInOrUpDto {
    user: string;
}

export class WorldMoveDto {
    ethAddress: string;
    x: number;
    y: number;
}

export class WorldEnterDto {
    ethAddress: string;
    x: number;
    y: number;
}

export class StartMiningDto {
    ethAddress: string;
    islandId: string;
}