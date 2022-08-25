package engine.entity;

import uuid.Uuid;
import engine.entity.EngineGameRect;
import engine.MathUtils;

enum GameEntityType {
	Ship;
	Shell;
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

	public function new(r, x, y) {
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

abstract class EngineBaseGameEntity {
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

	public function new(entityType:GameEntityType, x:Float, y:Float, rotation:Float, ?id:String, ?ownerId:String) {
		this.entityType = entityType;
		switch (entityType) {
			case Ship:
				this.shapeWidth = 200;
				this.shapeHeight = 80;
			case Shell:
				this.shapeWidth = 10;
				this.shapeHeight = 10;
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
		if (ownerId != null) {
			this.ownerId = ownerId;
		}
	}

	public function update(dt:Float) {
		customUpdate(dt);
		if (canMove)
			move(dt);
	}

	public function getGameRect() {
		return new EngineGameRect(x, y, shapeWidth, shapeHeight, MathUtils.dirToRad(direction));
	}

	public function collides(isCollides:Bool) {
		this.isCollides = isCollides;
		onCollision();
	}

	function move(dt:Float) {
		dx = currentSpeed * Math.cos(rotation) * dt;
		dy = currentSpeed * Math.sin(rotation) * dt;
		x += dx;
		y += dy;
	}

	public abstract function onCollision():Void;

	public abstract function customUpdate(dt:Float):Void;
}
