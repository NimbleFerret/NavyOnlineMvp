export class SignInOrUpDto {
    email: string;
    password: string;
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