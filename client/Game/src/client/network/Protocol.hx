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

// -------------------------------------
// WebSocket client messages
// -------------------------------------

typedef SocketClientMessageJoinGame = {
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

class Protocol {
	// Server -> Client events
	public static final SocketServerEventGameInit = 'SocketServerEventGameInit';
	public static final SocketServerEventAddShip = 'SocketServerEventAddShip';
	public static final SocketServerEventRemoveShip = 'SocketServerEventRemoveShip';
	public static final SocketServerEventUpdateWorldState = 'SocketServerEventUpdateWorldState';
	public static final SocketServerEventShipMove = 'SocketServerEventShipMove';
	public static final SocketServerEventShipShoot = 'SocketServerEventShipShoot';

	// Client -> Server events
	public static final SocketClientEventJoinGame = 'SocketClientEventJoinGame';
	public static final SocketClientEventMove = 'SocketClientEventMove';
	public static final SocketClientEventShoot = 'SocketClientEventShoot';
}
