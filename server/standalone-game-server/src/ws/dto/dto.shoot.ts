/* eslint-disable prettier/prettier */
export interface DtoShoot {
    playerId: string;
    left: boolean;
    shotParams: ShotParams[];
}

export interface ShotParams {
    playerId: string;
    left: boolean;
}