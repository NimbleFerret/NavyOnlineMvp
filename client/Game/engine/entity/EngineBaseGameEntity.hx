package engine.entity;

import uuid.Uuid;
import engine.entity.EngineGameRect;
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
	public var one:PosOffset;
	public var two:PosOffset;
	public var three:PosOffset;
	public var four:PosOffset;

	public function new(one, two, three, ?four) {
		this.one = one;
		this.two = two;
		this.three = three;
		this.four = four;
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
	public var speedStep = 50;
	public var minSpeed = -50;
	public var maxSpeed = 150;
	public var canMove = true;
	// ----------------------
	// Geom shape
	// ----------------------
	public final shapeWidth:Float;
	public final shapeHeight:Float;
	public final shapeWidthHalf:Float;
	public final shapeHeightHalf:Float;

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

	public function getGameRect() {
		return new EngineGameRect(x + rectOffsetX, y + rectOffsetY, shapeWidth, shapeHeight, MathUtils.dirToRad(direction));
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
