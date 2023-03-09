package game.engine.base;

import game.engine.base.geometry.Point;

// -------------------------------
// General
// -------------------------------

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
	public var rotation = 0.0;

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
	?rotation:Float,
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
	public var rotation:Float;
	public var id:String;
	public var ownerId:String;

	public function new(struct:BaseObjectEntityStruct) {
		this.x = struct.x;
		this.y = struct.y;
		this.acceleration = struct.acceleration;
		this.minSpeed = struct.minSpeed;
		this.maxSpeed = struct.maxSpeed;
		this.direction = struct.direction;
		this.rotation = struct.rotation;
		this.id = struct.id;
		this.ownerId = struct.ownerId;
	}
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

class PlayerInputCommand {
	public var index:Int;
	public var inputType:PlayerInputType;
	public var playerId:String;

	public function new(inputType:PlayerInputType, playerId:String, ?index:Int) {
		this.inputType = inputType;
		this.playerId = playerId;
		this.index = index;
	}
}

class InputCommandEngineWrapped {
	public var playerInputCommand:PlayerInputCommand;
	public var tick:Int;

	public function new(playerInputCommand:PlayerInputCommand, tick:Int) {
		this.playerInputCommand = playerInputCommand;
		this.tick = tick;
	}
}
