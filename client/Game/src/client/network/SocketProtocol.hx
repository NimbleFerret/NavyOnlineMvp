package client.network;

// -------------------------------------
// WebSocket server messages
// -------------------------------------

typedef EntityShip = {
	currentArmor:Int,
	currentHull:Int,
	baseArmor:Int,
	baseHull:Int,
	canMove:Bool,
	maxSpeed:Int,
	minSpeed:Int,
	speedStep:Int,
	currentSpeed:Int,
	dy:Int,
	dx:Int,
	y:Int,
	x:Int,
	rotation:Int,
	direction:String,
	isCollides:Bool,
	isAlive:Bool,
	shapeWidth:Int,
	shapeHeight:Int,
	shapeWidthHalf:Int,
	shapeHeightHalf:Int,
	id:String,
	ownerId:String
}

typedef SocketServerMessageGameInit = {
	tickRate:Int,
	worldStateSyncInterval:Int,
	ships:Array<EntityShip>
}

typedef SocketServerMessageUpdateWorldState = {
	ships:Array<EntityShip>
}

typedef SocketServerMessageAddShip = {
	ship:EntityShip
}

typedef SocketServerMessageRemoveShip = {
	shipId:String
}

typedef SocketServerMessageShipMove = {
	shipId:String,
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
	ships:Array<EntityShip>
}

// -------------------------------------
// WebSocket client messages
// -------------------------------------

typedef SocketClientMessageJoinGame = {
	playerId:String,
	instanceId:String
}

typedef SocketClientMessageLeaveGame = {
	playerId:String
}

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
	public static final SocketServerEventAddShip = 'SocketServerEventAddShip';
	public static final SocketServerEventRemoveShip = 'SocketServerEventRemoveShip';
	public static final SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
	public static final SocketServerEventShipMove = 'SocketServerEventShipMove';
	public static final SocketServerEventShipShoot = 'SocketServerEventShipShoot';
	public static final SocketServerEventSync = 'SocketServerEventSync';

	// Client -> Server events
	public static final SocketClientEventPing = 'SocketClientEventPing';
	public static final SocketClientEventJoinGame = 'SocketClientEventJoinGame';
	public static final SocketClientEventLeaveGame = 'SocketClientEventLeaveGame';
	public static final SocketClientEventMove = 'SocketClientEventMove';
	public static final SocketClientEventShoot = 'SocketClientEventShoot';
	public static final SocketClientEventSync = 'SocketClientEventSync';
	public static final SocketClientEventRespawn = 'SocketClientEventRespawn';
}
