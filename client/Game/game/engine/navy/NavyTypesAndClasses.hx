package game.engine.navy;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.geometry.Point;

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

enum abstract Side(Int) {
	var LEFT = 1;
	var RIGHT = 2;
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

typedef ShellObjectEntityStruct = {
	> BaseObjectEntityStruct,
	rotation:Float,
	side:Side,
	pos:Int,
	damage:Int,
	range:Int,
}

class ShellObjectEntity extends BaseObjectEntity {
	public var side:Side;
	public var pos:Int;
	public var damage:Int;
	public var range:Int;

	public function new(struct:ShellObjectEntityStruct) {
		super(struct);

		this.rotation = struct.rotation;
		this.side = struct.side;
		this.pos = struct.pos;
		this.damage = struct.damage;
		this.range = struct.range;
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

typedef ShootInputDetails = {
	var side:Side;
	var aimAngleRads:Float;
}

class NavyInputCommand extends PlayerInputCommand {
	public var shootDetails:ShootInputDetails;

	public function new(inputType:PlayerInputType, playerId:String, ?index:Int, ?shootDetails:ShootInputDetails) {
		super(inputType, playerId, index);
		this.shootDetails = shootDetails;
	}
}
