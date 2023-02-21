package game.engine.entity;

import uuid.Uuid;
import game.engine.entity.TypesAndClasses;
import game.engine.entity.EngineShipEntityConfig;
import game.engine.geometry.Rectangle;

interface GameEntityCustomUpdate {
	public function onUpdate():Void;
	public function postUpdate():Void;
}

interface GameEntityCustomCollide {
	public function onCollide():Void;
}

class EngineBaseGameEntity {
	// ----------------------
	// General
	// ----------------------
	private var baseObjectEntity:BaseObjectEntity;

	// public var id:String;
	// public var ownerId:String;
	public var entityType:GameEntityType;
	public var isAlive = true;
	public var isCollides = true;
	public var serverSide = true;
	public var killerId:String;

	// ----------------------
	// Movement
	// ----------------------
	// public var direction = GameEntityDirection.East;
	public var rotation = 0.0;
	// public var x = 0.0;
	// public var y = 0.0;
	public var dx = 0.0;
	public var dy = 0.0;
	public var currentSpeed = 0.0;
	// public var acceleration = 50;
	// public var minSpeed = -50;
	// public var maxSpeed = 150;
	public var canMove = true;

	// ----------------------
	// Geom shape
	// ----------------------
	public final shape:EntityShape;

	public var customUpdate:GameEntityCustomUpdate;
	public var customCollide:GameEntityCustomCollide;

	public function new(entityType:GameEntityType, baseObjectEntity:BaseObjectEntity) {
		this.entityType = entityType;
		this.baseObjectEntity = baseObjectEntity;
		this.shape = EngineShipEntityConfig.EntityShapeByType.get(entityType);

		if (baseObjectEntity.id == null) {
			this.baseObjectEntity.id = Uuid.short();
		}
		if (baseObjectEntity.ownerId == null) {
			this.baseObjectEntity.ownerId = Uuid.short();
		}
	}

	public function update(dt:Float) {
		if (customUpdate != null)
			customUpdate.onUpdate();
		if (canMove)
			move(dt);
		if (customUpdate != null)
			customUpdate.postUpdate();
	}

	public function getBodyRectangle() {
		final shapeWidth = shape.width;
		final shapeHeight = shape.height;
		final rectOffsetX = shape.rectOffsetX;
		final rectOffsetY = shape.rectOffsetY;
		final x = baseObjectEntity.x;
		final y = baseObjectEntity.y;
		final direction = baseObjectEntity.direction;
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
		baseObjectEntity.x += dx;
		baseObjectEntity.y += dy;
	}

	public function accelerateLeft() {
		baseObjectEntity.x += baseObjectEntity.acceleration;
	}

	public function accelerateRight() {
		baseObjectEntity.x -= baseObjectEntity.acceleration;
	}

	public function accelerateUp() {
		baseObjectEntity.y += baseObjectEntity.acceleration;
	}

	public function accelerateDown() {
		baseObjectEntity.y -= baseObjectEntity.acceleration;
	}

	// Getters

	public function getX() {
		return baseObjectEntity.x;
	}

	public function getY() {
		return baseObjectEntity.y;
	}

	public function getId() {
		return baseObjectEntity.id;
	}

	public function getOwnerId() {
		return baseObjectEntity.ownerId;
	}

	public function getDirection() {
		return baseObjectEntity.direction;
	}

	public function getMaxSpeed() {
		return baseObjectEntity.maxSpeed;
	}

	public function getMinSpeed() {
		return baseObjectEntity.minSpeed;
	}

	// Setters

	public function setX(x:Float) {
		baseObjectEntity.x = x;
	}

	public function setY(y:Float) {
		baseObjectEntity.y = y;
	}
}
