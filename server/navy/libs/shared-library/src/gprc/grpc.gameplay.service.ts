// import { ClientOptions, Transport } from "@nestjs/microservices";
// import { join } from "path";
// import { Observable } from "rxjs";
// import { SectorInfo } from "./grpc.world.service"

// export interface GameplayService {
//     CreateOrJoinGame(request: CreateOrJoinGameRequest): Observable<CreateOrJoinGameResponse>;
// }

// export const GameplayServiceName = 'GameplayService';
// export const GameplayServiceGrpcClientName = 'gameplayservice';
// export const GameplayServiceGrpcPackage = 'gameplayservice';

// export function GameplayServiceGrpcClientOptions(port: number) {
//     return {
//         transport: Transport.GRPC,
//         options: {
//             url: 'localhost:' + port,
//             package: GameplayServiceGrpcPackage,
//             protoPath: join(__dirname, '../../proto/gameplay.service.proto'),
//         }
//     } as ClientOptions
// };

// //-----------------------------

// export interface CreateOrJoinGameRequest {
//     sectorInfo: SectorInfo;
// }

// export interface CreateOrJoinGameResponse {
//     success: boolean;
//     instanceId: string;
// }

// //-----------------------------