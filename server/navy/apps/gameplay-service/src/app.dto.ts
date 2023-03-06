export interface CreateOrJoinGameRequestDto {
    user: string;
}

export interface AddBotRequestDto {
    x?: number;
    y?: number;
}

export interface EnableFeatureRequestDto {
    enable: boolean;
}