package game.engine.entity;

import game.engine.geometry.Point;

// -------------------------------
// General
// -------------------------------

enum abstract GameEntityType(Int) {
	var SMALL_SHIP = 1;
	var MEDIUM_SHIP = 2;
	var LARGE_SHIP = 3;
	var SHELL = 4;
	var CHARACTER = 5;
}

enum abstract GameEntityDirection(Int) {
	var EAST = 1;
	var NORTH = 2;
	var NORTH_EAST = 3;
	var NORTH_WEST = 4;
	var SOUTH = 5;
	var SOUTH_EAST = 6;
	var SOUTH_WEST = 7;
	var WEST = 8;
}

enum abstract Side(Int) {
	var LEFT = 1;
	var RIGHT = 2;
}

class PosOffset {
	public var r:Float;
	public var x:Float;
	public var y:Float;

	public function new(x:Float, y:Float, r:Float = 0) {
		this.x = x;
		this.y = y;
		this.r = r;
	}
}

class PosOffsetArray {
	public var positions = new Array<PosOffset>();

	public function new(positions:Array<PosOffset>) {
		this.positions = positions;
	}
}

class EntityShape {
	public var width:Float;
	public var height:Float;
	public var rectOffsetX:Float;
	public var rectOffsetY:Float;
	public var angle = 0.0;

	public function new(width:Float, height:Float, rectOffsetX:Float = 0, rectOffsetY:Float = 0) {
		this.width = width;
		this.height = height;
		this.rectOffsetX = rectOffsetX;
		this.rectOffsetY = rectOffsetY;
	}
}

typedef BaseObjectEntityStruct = {
	x:Float,
	y:Float,
	?acceleration:Int,
	?minSpeed:Int,
	?maxSpeed:Int,
	?direction:GameEntityDirection,
	?id:String,
	?ownerId:String
}

class BaseObjectEntity {
	public var x:Float;
	public var y:Float;
	public var acceleration:Int;
	public var minSpeed:Int;
	public var maxSpeed:Int;
	public var direction:GameEntityDirection;
	public var id:String;
	public var ownerId:String;

	public function new(struct:BaseObjectEntityStruct) {
		this.x = struct.x;
		this.y = struct.y;
		this.acceleration = struct.acceleration;
		this.minSpeed = struct.minSpeed;
		this.maxSpeed = struct.maxSpeed;
		this.direction = struct.direction;
		this.id = struct.id;
		this.ownerId = struct.ownerId;
	}
}

// -------------------------------
// Ship related
// -------------------------------

enum abstract Role(Int) {
	var BOT = 1;
	var BOSS = 2;
	var PLAYER = 3;
}

enum abstract ShipHullSize(Int) {
	var SMALL = 1;
	var MEDIUM = 2;
	var LARGE = 3;
}

enum abstract ShipWindows(Int) {
	var ONE = 1;
	var TWO = 2;
	var NONE = 3;
}

enum abstract ShipCannons(Int) {
	var ONE = 1;
	var TWO = 2;
	var THREE = 3;
	var FOUR = 4;
	var ZERO = 5;
}

typedef ShipObjectEntityStruct = {
	> BaseObjectEntityStruct,
	serverShipRef:String,
	free:Bool,
	role:Role,
	shipHullSize:ShipHullSize,
	shipWindows:ShipWindows,
	shipCannons:ShipCannons,
	cannonsRange:Int,
	cannonsDamage:Int,
	cannonsAngleSpread:Int,
	armor:Int,
	hull:Int,
	accDelay:Float,
	turnDelay:Float,
	fireDelay:Float
}

class ShipObjectEntity extends BaseObjectEntity {
	public var serverShipRef:String;
	public var free:Bool;
	public var role:Role;
	public var shipHullSize:ShipHullSize;
	public var shipWindows:ShipWindows;
	public var shipCannons:ShipCannons;
	public var cannonsRange:Int;
	public var cannonsDamage:Int;
	public var cannonsAngleSpread:Int;
	public var armor:Int;
	public var hull:Int;
	public var accDelay:Float;
	public var turnDelay:Float;
	public var fireDelay:Float;

	public function new(struct:ShipObjectEntityStruct) {
		super(struct);

		this.serverShipRef = struct.serverShipRef;
		this.free = struct.free;
		this.role = struct.role;
		this.shipHullSize = struct.shipHullSize;
		this.shipWindows = struct.shipWindows;
		this.shipCannons = struct.shipCannons;
		this.cannonsRange = struct.cannonsRange;
		this.cannonsDamage = struct.cannonsDamage;
		this.cannonsAngleSpread = struct.cannonsAngleSpread;
		this.armor = struct.armor;
		this.hull = struct.hull;
		this.accDelay = struct.accDelay;
		this.turnDelay = struct.turnDelay;
		this.fireDelay = struct.fireDelay;
	}
}

typedef ShellRnd = {
	speed:Int,
	dir:Int,
	rotation:Int
}

typedef ShellObjectEntityStruct = {
	> BaseObjectEntityStruct,
	rotation:Float,
	side:Side,
	pos:Int,
	damage:Int,
	range:Int,
	?shellRnd:ShellRnd
}

class ShellObjectEntity extends BaseObjectEntity {
	public var rotation:Float;
	public var side:Side;
	public var pos:Int;
	public var damage:Int;
	public var range:Int;
	public var shellRnd:ShellRnd;

	public function new(struct:ShellObjectEntityStruct) {
		super(struct);

		this.rotation = struct.rotation;
		this.side = struct.side;
		this.pos = struct.pos;
		this.damage = struct.damage;
		this.range = struct.range;
		this.shellRnd = struct.shellRnd;
	}
}

typedef CannonFiringRangeDetails = {
	var origin:Point;
	var center:Point;
	var right:Point;
	var left:Point;
}

// -------------------------------
// Multiplayer
// -------------------------------

enum abstract PlayerInputType(Int) {
	var MOVE_UP = 1;
	var MOVE_DOWN = 2;
	var MOVE_LEFT = 3;
	var MOVE_RIGHT = 4;
	var SHOOT = 5;
}

typedef ShootInputDetails = {
	var side:Side;
	var aimAngleRads:Float;
}

typedef PlayerInputCommand = {
	var index:Int;
	var inputType:PlayerInputType;
	// var ?entityId:String;
	var ?playerId:String;
	var ?shootInputDetails:ShootInputDetails;
}
