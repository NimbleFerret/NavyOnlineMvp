// /* eslint-disable prettier/prettier */
// import { Injectable, Logger } from '@nestjs/common';
// import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
// import { trace } from 'console';
// import { AppEvents, PlayerDisconnectedEvent } from 'src/app.events';
// import { SectorContent, SocketClientMessageJoinGame, SocketClientMessageMove } from 'src/ws/ws.protocol';
// import { IslandInstance } from './island.instance';

// @Injectable()
// export class IslandService {

//     private readonly maxPlayersPerInstance = 10;
//     private readonly islandInstances = new Map<string, IslandInstance>();
//     private readonly sectorInstance = new Map<string, string>();
//     private readonly playerInstaneMap = new Map<string, string>();

//     constructor(private eventEmitter: EventEmitter2) {
//     }

//     // -------------------------------------
//     // World managed api
//     // -------------------------------------

//     joinWorldOrCreate(x: number, y: number, sectorContent: SectorContent) {
//         const islandInstanceId = this.sectorInstance.get(x + '+' + y);
//         if (islandInstanceId) {
//             const islandInstance = this.islandInstances.get(islandInstanceId);
//             if (islandInstance.getPlayersCount() < this.maxPlayersPerInstance) {
//                 return {
//                     result: true,
//                     playersCount: islandInstance.getPlayersCount(),
//                     instanceId: islandInstance.instanceId
//                 }
//             } else {
//                 return {
//                     result: false,
//                     reason: 'Sector is full'
//                 }
//             }

//         } else {
//             const islandInstance = new IslandInstance(this.eventEmitter, x, y);
//             this.islandInstances.set(islandInstance.instanceId, islandInstance);
//             this.sectorInstance.set(x + '+' + y, islandInstance.instanceId);

//             return {
//                 result: true,
//                 playersCount: islandInstance.getPlayersCount(),
//                 instanceId: islandInstance.instanceId
//             }
//         }
//     }

//     // -------------------------------------
//     // Admin api
//     // -------------------------------------

//     getInstancesInfo() {
//         const result = [];
//         this.islandInstances.forEach((v) => {
//             // TODO add x and y pos
//             result.push({
//                 id: v.instanceId,
//                 players: v.getPlayersCount()
//             });
//         });
//         return result;
//     }

//     // -------------------------------------
//     // Client events from WebSocket
//     // ------------------------------------- 

//     @OnEvent(AppEvents.PlayerJoinedIslandInstance)
//     async handlePlayerJoinedEvent(data: SocketClientMessageJoinGame) {
//         // Create a new instance and add player into it
//         if (!this.playerInstaneMap.has(data.playerId)) {
//             const islandInstance = this.islandInstances.get(data.instanceId);
//             if (islandInstance) {
//                 islandInstance.handlePlayerJoinedEvent(data);
//                 this.playerInstaneMap.set(data.playerId, data.instanceId);
//                 Logger.log(`Player: ${data.playerId} was added to the existing instance: ${data.instanceId}`);
//             } else {
//                 Logger.error(`Unable to add player into any game instance. Players: ${this.playerInstaneMap.size}, Instances: ${this.islandInstances.size}`);
//             }
//         } else {
//             // TODO add logs
//             Logger.error('Player cant join more than once');
//         }
//     }

//     @OnEvent(AppEvents.PlayerDisconnected)
//     async handlePlayerDisconnected(data: PlayerDisconnectedEvent) {
//         const instanceId = this.playerInstaneMap.get(data.playerId);
//         if (instanceId) {
//             this.playerInstaneMap.delete(data.playerId);
//             const islandInstance = this.islandInstances.get(instanceId);
//             islandInstance.handlePlayerDisconnected(data);
//             if (islandInstance.getPlayersCount() == 0) {
//                 Logger.log(`No more player in instance: ${instanceId}, destroying...`);
//                 islandInstance.destroy();
//                 this.islandInstances.delete(instanceId);

//                 let sectorKeyToDelete: string;
//                 this.sectorInstance.forEach((v, k) => {
//                     if (v == instanceId) {
//                         sectorKeyToDelete = k;
//                     }
//                 });
//                 this.sectorInstance.delete(sectorKeyToDelete);

//                 Logger.log(`Instance: ${instanceId} destroyed !`);
//             }
//         } else {
//             // TODO add logs
//         }
//     }

//     @OnEvent(AppEvents.PlayerMove)
//     async handlePlayerMove(data: SocketClientMessageMove) {
//         const instanceId = this.playerInstaneMap.get(data.playerId);
//         if (instanceId) {
//             const islandInstance = this.islandInstances.get(instanceId);
//             islandInstance.handlePlayerMove(data);
//         } else {
//             // TODO add logs
//         }
//     }
// }
