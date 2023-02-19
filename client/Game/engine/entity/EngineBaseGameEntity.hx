package engine.entity;

import uuid.Uuid;
import engine.geometry.Rectangle;
import engine.MathUtils;

enum GameEntityType {
	Ship;
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

interface GameEntityCustomUpdate {
	public function onUpdate():Void;
}

interface GameEntityCustomCollide {
	public function onCollide():Void;
}

class EngineBaseGameEntity {
	// ----------------------
	// General
	// ----------------------
	public var id:String;
	public var ownerId:String;
	public var entityType:GameEntityType;
	public var isAlive = true;
	public var isCollides = true;
	public var serverSide = true;
	public var killerId:String;

	// ----------------------
	// Movement
	// ----------------------
	public var direction = GameEntityDirection.East;
	public var rotation = 0.0;
	public var x = 0.0;
	public var y = 0.0;
	public var dx = 0.0;
	public var dy = 0.0;
	public var currentSpeed = 0.0;
	public var acc = 50;
	public var minSpeed = -50;
	public var maxSpeed = 150;
	public var canMove = true;

	// ----------------------
	// Geom shape
	// ----------------------
	public var shapeWidth:Float;
	public var shapeHeight:Float;
	public var shapeWidthHalf:Float;
	public var shapeHeightHalf:Float;

	public var rectOffsetX = 0;
	public var rectOffsetY = 0;

	public var customUpdate:GameEntityCustomUpdate;
	public var customCollide:GameEntityCustomCollide;

	public function new(entityType:GameEntityType, x:Float, y:Float, rotation:Float, ?id:String, ?ownerId:String) {
		this.entityType = entityType;
		switch (entityType) {
			case Ship:
				this.shapeWidth = 200;
				this.shapeHeight = 80;
			case Shell:
				this.shapeWidth = 10;
				this.shapeHeight = 10;
			case Character:
				this.shapeWidth = 60;
				this.shapeHeight = 60;
		}
		this.shapeWidthHalf = shapeWidth / 2;
		this.shapeHeightHalf = shapeHeight / 2;
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		if (id == null) {
			this.id = Uuid.short();
		} else {
			this.id = id;
		}
		if (ownerId == null) {
			this.ownerId = Uuid.short();
		} else {
			this.ownerId = ownerId;
		}
	}

	public function update(dt:Float) {
		if (customUpdate != null)
			customUpdate.onUpdate();
		if (canMove)
			move(dt);
	}

	public function getBodyRectangle() {
		return new Rectangle(x + rectOffsetX, y + rectOffsetY, shapeWidth, shapeHeight, MathUtils.dirToRad(direction));
	}

	public function collides(isCollides:Bool) {
		this.isCollides = isCollides;
		if (customCollide != null)
			customCollide.onCollide();
	}

	function move(dt:Float) {
		dx = currentSpeed * Math.cos(rotation) * dt;
		dy = currentSpeed * Math.sin(rotation) * dt;
		x += dx;
		y += dy;
	}
}
