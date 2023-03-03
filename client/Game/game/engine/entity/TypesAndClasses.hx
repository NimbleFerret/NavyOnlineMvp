package game.engine.entity;

import h2d.col.Point;

// -------------------------------
// General
// -------------------------------

enum GameEntityType {
	SmallShip;
	MediumShip;
	LargeShip;
	Shell;
	Character;
}

enum GameEntityDirection {
	East;
	North;
	NorthEast;
	NorthWest;
	South;
	SouthEast;
	SouthWest;
	West;
}

enum Side {
	Left;
	Right;
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

typedef BaseObjectEntity = {
	x:Float,
	y:Float,
	?acceleration:Int,
	?minSpeed:Int,
	?maxSpeed:Int,
	?direction:GameEntityDirection,
	?id:String,
	?ownerId:String
}

// -------------------------------
// Ship related
// -------------------------------

enum Role {
	Bot;
	Boss;
	Player;
}

enum ShipHullSize {
	SMALL;
	MEDIUM;
	LARGE;
}

enum ShipWindows {
	ONE;
	TWO;
	NONE;
}

enum ShipCannons {
	ONE;
	TWO;
	THREE;
	FOUR;
	ZERO;
}

typedef ShipObjectEntity = {
	> BaseObjectEntity,
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

typedef ShellRnd = {
	speed:Int,
	dir:Int,
	rotation:Int
}

typedef ShellObjectEntity = {
	> BaseObjectEntity,
	rotation:Float,
	side:Side,
	pos:Int,
	damage:Int,
	range:Int,
	?shellRnd:ShellRnd
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

enum PlayerInputType {
	MOVE_UP;
	MOVE_DOWN;
	MOVE_LEFT;
	MOVE_RIGHT;
	SHOOT;
}

typedef ShootInputDetails = {
	var side:Side;
	var aimAngleRads:Float;
}

typedef PlayerInputCommand = {
	var index:Int;
	var inputType:PlayerInputType;
	var entityId:String;
	var ?playerId:String;
	var ?shootInputDetails:ShootInputDetails;
}
