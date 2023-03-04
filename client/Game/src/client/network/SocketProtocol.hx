package client.network;

import game.engine.entity.TypesAndClasses;

// -------------------------------------
// WebSocket server messages
// -------------------------------------

typedef SocketServerDailyTaskChange = {
	dailyPlayersKilledCurrent:Int,
	dailyPlayersKilledMax:Int,
	dailyBotsKilledCurrent:Int,
	dailyBotsKilledMax:Int,
	dailyBossesKilledCurrent:Int,
	dailyBossesKilledMax:Int
}

typedef SocketServerDailyTaskComplete = {
	dailyTaskType:Int,
	rewardNVY:Int,
	rewardAKS:Int,
}

typedef EntityCharacter = {
	y:Int,
	x:Int,
	id:String,
	ownerId:String
}

typedef SocketServerMessageGameInit = {
	tickRate:Int,
	worldStateSyncInterval:Int,
	entities:Array<Dynamic>
}

typedef SocketServerMessageUpdateWorldState = {
	entities:Array<Dynamic>
}

typedef SocketServerMessageAddEntity = {
	entity:Dynamic
}

typedef SocketServerMessageRemoveEntity = {
	entityId:String
}

typedef SocketServerMessageEntityMove = {
	entityId:String,
	up:Bool,
	down:Bool,
	left:Bool,
	right:Bool
}

typedef SocketServerMessageShipShoot = {
	playerId:String,
	left:Bool,
	shotParams:Array<ShotParams>
}

typedef SocketServerMessageSync = {
	entities:Array<Dynamic>
}

// -------------------------------------
// WebSocket client messages
// -------------------------------------

typedef SocketClientMessageJoinGame = {
	playerId:String,
	instanceId:String,
	sectorType:Int,
	?entityId:String
}

typedef SocketClientMessageLeaveGame = {
	playerId:String
}

typedef SocketClientMessageInput = {
	playerId:String,
	playerInputType:PlayerInputType,
}

//
typedef SocketClientMessageMove = {
	playerId:String,
	up:Bool,
	down:Bool,
	left:Bool,
	right:Bool
}

typedef SocketClientMessageShoot = {
	playerId:String,
	left:Bool,
	shotParams:Array<ShotParams>
}

//

typedef ShotParams = {
	speed:Int,
	dir:Int,
	rotation:Int
}

typedef SocketClientMessageSync = {
	playerId:String
}

typedef SocketClientMessageRespawn = {
	playerId:String
}

class SocketProtocol {
	// Server -> Client events
	public static final SocketServerEventPong = 'SocketServerEventPong';
	public static final SocketServerEventGameInit = 'SocketServerEventGameInit';
	public static final SocketServerEventAddEntity = 'SocketServerEventAddEntity';
	public static final SocketServerEventRemoveEntity = 'SocketServerEventRemoveEntity';
	public static final SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
	public static final SocketServerEventEntityMove = 'SocketServerEventEntityMove';
	public static final SocketServerEventShipShoot = 'SocketServerEventShipShoot';
	public static final SocketServerEventSync = 'SocketServerEventSync';

	public static final SocketServerEventDailyTaskUpdate = 'SocketServerEventDailyTaskUpdate';
	public static final SocketServerEventDailyTaskReward = 'SocketServerEventDailyTaskReward';

	// Client -> Server events
	public static final SocketClientEventPing = 'SocketClientEventPing';
	public static final SocketClientEventJoinGame = 'SocketClientEventJoinGame';
	public static final SocketClientEventLeaveGame = 'SocketClientEventLeaveGame';

	public static final SocketClientEventInput = 'SocketClientEventInput';
	public static final SocketClientEventMove = 'SocketClientEventMove';
	public static final SocketClientEventShoot = 'SocketClientEventShoot';

	public static final SocketClientEventSync = 'SocketClientEventSync';
	public static final SocketClientEventRespawn = 'SocketClientEventRespawn';
}
