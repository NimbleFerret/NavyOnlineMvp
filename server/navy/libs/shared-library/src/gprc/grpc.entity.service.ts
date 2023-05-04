import { ClientOptions, Transport } from "@nestjs/microservices";
import { join } from "path";
import { Observable } from "rxjs";
import { Config } from "../config";

export interface EntityService {
    GetRandomCaptainTrait(request: GetRandomCaptainTraitRequest): Observable<GetRandomCaptainTraitResponse>;
    GenerateCaptainTraits(request: GenerateCaptainTraitsRequest): Observable<GenerateCaptainTraitsResponse>;
}

//-----------------------------
// GetRandomCaptainTrait
//-----------------------------

export interface ICaptainTrait {
    index: number;
    description: string;
    bonusType: string;
    shipStatsAffected: string[];
}

export interface GetRandomCaptainTraitRequest {
    excludeIds: number[];
    count: number;
}

export interface GetRandomCaptainTraitResponse {
    traits: ICaptainTrait[];
}

//-----------------------------
// GetRandomCaptainTrait
//-----------------------------

export interface GenerateCaptainTraitsRequest {
    rarity: number;
}

export interface GenerateCaptainTraitsResponse {
    traits: ICaptainTrait[];
}

export const EntityServiceName = 'EntityService';
export const EntityServiceGrpcClientName = 'EntityService';
export const EntityServiceGrpcPackage = 'entityservice';

export const EntityServiceGrpcClientOptions: ClientOptions = {
    transport: Transport.GRPC,
    options: {
        url: 'localhost:' + Config.ENTITY_SERVICE_PORT,
        package: EntityServiceGrpcPackage,
        protoPath: join(__dirname, '../../proto/entity.service.proto'),
    },
};