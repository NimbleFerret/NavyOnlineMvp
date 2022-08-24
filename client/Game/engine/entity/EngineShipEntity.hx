package engine.entity;

import engine.entity.EngineBaseGameEntity;
import engine.MathUtils;

class EngineShipEntity extends EngineBaseGameEntity {
	public static final ShapeOffsetByDir:Map<GameEntityDirection, PosOffset> = [
		GameEntityDirection.East => new PosOffset(0, -100, -40),
		GameEntityDirection.North => new PosOffset(-90, -50, 110),
		GameEntityDirection.NorthEast => new PosOffset(-26, -110, 19),
		GameEntityDirection.NorthWest => new PosOffset(-155, -65, 87),
		GameEntityDirection.South => new PosOffset(90, 26, 72),
		GameEntityDirection.SouthEast => new PosOffset(26, -80, -6),
		GameEntityDirection.SouthWest => new PosOffset(-23, -113, 19),
		GameEntityDirection.West => new PosOffset(0, -110, -42),
	];

	public static final LeftCanonsOffsetByDir:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(0, -65, -50), new PosOffset(0, -25, -50), new PosOffset(0, 15, -50)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(0, -72, 64), new PosOffset(0, -72, 31), new PosOffset(0, -72, -3)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(0, -73, 4), new PosOffset(0, -46, -10), new PosOffset(0, -19, -21)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(0, -82, 42), new PosOffset(0, -52, 58), new PosOffset(0, -23, 69)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(0, 58, -36), new PosOffset(0, 58, -2), new PosOffset(0, 58, 31)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(0, -14, -27), new PosOffset(0, 10, -10), new PosOffset(0, 36, 2)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(0, 27, 61), new PosOffset(0, 56, 48), new PosOffset(0, 90, 33)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, -27, 69), new PosOffset(0, 14, 69), new PosOffset(0, 57, 69)),
	];

	public static final RightCanonsOffsetByDir:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(0, -65, 71), new PosOffset(0, -25, 71), new PosOffset(0, 15, 71)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(0, 57, 65), new PosOffset(0, 57, 30), new PosOffset(0, 57, -4)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(0, 10, 70), new PosOffset(0, 40, 57), new PosOffset(0, 70, 45)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(0, 61, 6), new PosOffset(0, 31, -6), new PosOffset(0, 10, -21)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(0, -69, -36), new PosOffset(0, -69, -2), new PosOffset(0, -69, 31)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(0, -103, 31), new PosOffset(0, -73, 50), new PosOffset(0, -44, 65)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(0, -2, -31), new PosOffset(0, -27, -18), new PosOffset(0, -56, -6)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, 56, -48), new PosOffset(0, 15, -48), new PosOffset(0, -27, -48)),
	];

	// Callbacks
	public var speedChangeCallback:Float->Void;
	public var directionChangeCallback:GameEntityDirection->Void;

	// -----------------------
	// Health and damage stuff
	// -----------------------
	public final baseHull = 1000;
	public final baseArmor = 1000;

	public var currentHull = 1000;
	public var currentArmor = 1000;

	// TODO use direction instead of rotation here
	public function new(x:Float, y:Float, ?id:String, ?ownerId:String) {
		super(GameEntityType.Ship, x, y, 0, id, ownerId);
	}

	// -----------------------
	// Movement
	// -----------------------

	public function accelerate() {
		currentSpeed += speedStep;
		if (currentSpeed > maxSpeed)
			currentSpeed = maxSpeed;
		if (speedChangeCallback != null) {
			speedChangeCallback(currentSpeed);
		}
	}

	public function decelerate() {
		currentSpeed -= speedStep;
		if (currentSpeed < minSpeed)
			currentSpeed = minSpeed;
		if (speedChangeCallback != null) {
			speedChangeCallback(currentSpeed);
		}
	}

	public function rotateLeft() {
		rotation -= MathUtils.degreeToRads(45);
		switch (direction) {
			case East:
				direction = NorthEast;
			case NorthEast:
				direction = North;
			case North:
				direction = NorthWest;
			case NorthWest:
				direction = West;
			case West:
				direction = SouthWest;
			case SouthWest:
				direction = South;
			case South:
				direction = SouthEast;
			case SouthEast:
				direction = East;
		}
		if (directionChangeCallback != null) {
			directionChangeCallback(direction);
		}
	}

	public function rotateRight() {
		rotation += MathUtils.degreeToRads(45);
		switch (direction) {
			case East:
				direction = SouthEast;
			case SouthEast:
				direction = South;
			case South:
				direction = SouthWest;
			case SouthWest:
				direction = West;
			case West:
				direction = NorthWest;
			case NorthWest:
				direction = North;
			case North:
				direction = NorthEast;
			case NorthEast:
				direction = East;
		}
		if (directionChangeCallback != null) {
			directionChangeCallback(direction);
		}
	}

	// -----------------------
	// Battle
	// -----------------------

	public function inflictDamage(damage:Int) {
		if (currentArmor > 0) {
			final damageDiff = Math.round(Math.abs(currentArmor - damage));
			if (currentArmor - damage < 0) {
				currentArmor = 0;
				currentHull -= damageDiff;
			} else {
				currentArmor -= damage;
			}
		} else {
			currentHull -= damage;
			if (currentHull <= 0) {
				isAlive = false;
			}
		}
	}

	// -----------------------
	// General
	// -----------------------

	public function getCanonOffsetBySideAndIndex(side:Side, index:Int) {
		final offset = side == Side.Left ? EngineShipEntity.LeftCanonsOffsetByDir.get(direction) : EngineShipEntity.RightCanonsOffsetByDir.get(direction);

		var offsetX = offset.one.x;
		var offsetY = offset.one.y;

		if (index == 1) {
			offsetX = offset.two.x;
			offsetY = offset.two.y;
		} else if (index == 2) {
			offsetX = offset.three.x;
			offsetY = offset.three.y;
		}

		return {
			x: x + offsetX,
			y: y + offsetY
		}
	}

	public function customUpdate(dt:Float) {}

	public function onCollision() {}
}
