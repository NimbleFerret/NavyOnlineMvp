package engine.entity;

import engine.entity.EngineBaseGameEntity;
import engine.MathUtils;

enum Role {
	Bot;
	Boss;
	Player;
}

enum ShipHullSize {
	SMALL;
	MEDIUM;
}

enum ShipWindows {
	ONE;
	TWO;
	NONE;
}

enum ShipGuns {
	ONE;
	TWO;
	THREE;
	FOUR;
}

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

	// Small size
	public static final RightCanonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-28, 26), new PosOffset(0, 26), new PosOffset(28, 26)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(17, 31), new PosOffset(36, 21), new PosOffset(55, 13)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(50, 10), new PosOffset(50, -13), new PosOffset(50, 33)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(50, -16), new PosOffset(28, -26), new PosOffset(7, -33)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(50, -50), new PosOffset(21, -50), new PosOffset(-8, -50)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(-10, -41), new PosOffset(-27, -34), new PosOffset(-41, -27)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(-50, -31), new PosOffset(-50, -11), new PosOffset(-50, 10)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(-70, 10), new PosOffset(-50, 19), new PosOffset(-28, 29)),
	];

	public static final LeftCanonsOffsetByDirSm:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-28, -52), new PosOffset(0, -52), new PosOffset(28, -52)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(-55, -16), new PosOffset(-35, -24), new PosOffset(-16, -32)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(-50, 10), new PosOffset(-50, -13), new PosOffset(-50, 33)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(-13, 32), new PosOffset(-32, 22), new PosOffset(-52, 11)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(50, 27), new PosOffset(21, 27), new PosOffset(-8, 27)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(70, 5), new PosOffset(50, 15), new PosOffset(31, 25)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(50, -31), new PosOffset(50, -11), new PosOffset(50, 10)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(11, -32), new PosOffset(27, -25), new PosOffset(46, -15)),
	];

	// Mid size
	public static final RightCanonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-49, 54), new PosOffset(-19, 54), new PosOffset(11, 54), new PosOffset(41, 54)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(21, 51), new PosOffset(47, 38), new PosOffset(72, 25), new PosOffset(96, 12)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(47, 8), new PosOffset(47, -13), new PosOffset(47, -34), new PosOffset(47, -55)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(27, -17), new PosOffset(5, -28), new PosOffset(-19, -40), new PosOffset(-42, -51)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, -59), new PosOffset(-24, -59), new PosOffset(-51, -59), new PosOffset(-78, -59)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(-61, -28), new PosOffset(-82, -17), new PosOffset(-103, -6), new PosOffset(-125, 5)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(-87, -10), new PosOffset(-87, 10), new PosOffset(-87, 30), new PosOffset(-87, 50)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(-82, 33), new PosOffset(-60, 44), new PosOffset(-39, 54), new PosOffset(-18, 64)),
	];

	public static final LeftCanonsOffsetByDirMid:Map<GameEntityDirection, PosOffsetArray> = [
		GameEntityDirection.East => new PosOffsetArray(new PosOffset(-43, -59), new PosOffset(-15, -59), new PosOffset(13, -59), new PosOffset(41, -59)),
		GameEntityDirection.NorthEast => new PosOffsetArray(new PosOffset(-63, -20), new PosOffset(-43, -30), new PosOffset(-23, -40), new PosOffset(-3, -50)),
		GameEntityDirection.North => new PosOffsetArray(new PosOffset(-87, 8), new PosOffset(-87, -13), new PosOffset(-87, -34), new PosOffset(-87, -55)),
		GameEntityDirection.NorthWest => new PosOffsetArray(new PosOffset(-60, 48), new PosOffset(-81, 38), new PosOffset(-102, 28), new PosOffset(-123, 18)),
		GameEntityDirection.West => new PosOffsetArray(new PosOffset(0, 54), new PosOffset(-24, 54), new PosOffset(-51, 54), new PosOffset(-78, 54)),
		GameEntityDirection.SouthWest => new PosOffsetArray(new PosOffset(42, 36), new PosOffset(24, 44), new PosOffset(-3, 59), new PosOffset(-26, 70)),
		GameEntityDirection.South => new PosOffsetArray(new PosOffset(48, -10), new PosOffset(48, 10), new PosOffset(48, 30), new PosOffset(48, 50)),
		GameEntityDirection.SouthEast => new PosOffsetArray(new PosOffset(25, -26), new PosOffset(47, -16), new PosOffset(70, -4), new PosOffset(93, 6)),
	];

	public var role:Role;

	// -----------------------
	// Callbacks
	// -----------------------
	public var speedChangeCallback:Float->Void;
	public var directionChangeCallbackLeft:GameEntityDirection->Void;
	public var directionChangeCallbackRight:GameEntityDirection->Void;

	public var shootLeftCallback:Void->Void;
	public var shootRightCallback:Void->Void;

	// -----------------------
	// Ship details
	// -----------------------
	public final shipHullSize:ShipHullSize;
	public final shipWindows:ShipWindows;
	public final shipGuns:ShipGuns;

	// -----------------------
	// Health and damage stuff
	// -----------------------
	public var hull = 1000;
	public var armor = 1000;
	public var currentHull = 1000;
	public var currentArmor = 1000;

	public var cannonsRange = 600;
	public var cannonsDamage = 50;

	// -----------------------
	// Input
	// -----------------------
	public var accDelay = 1.0;
	public var turnDelay = 1.0;
	public var fireDelay = 0.200;

	private var timeSinceLastShipsPosUpdate = 0.0;
	private var lastMovementInputCheck = 0.0;
	private var lastRotationInputCheck = 0.0;
	private var lastLeftShootInputCheck = 0.0;
	private var lastRightShootInputCheck = 0.0;

	// Bot stuff
	public var allowShoot = false;

	public function new(role:Role, x:Float, y:Float, shipHullSize:ShipHullSize, shipWindows:ShipWindows, shipGuns:ShipGuns, cannonsRange:Int,
			cannonsDamage:Int, armor:Int, hull:Int, maxSpeed:Int, acc:Int, accDelay:Float, turnDelay:Float, fireDelay:Float, ?id:String, ?ownerId:String) {
		super(GameEntityType.Ship, x, y, 0, id, ownerId);
		this.role = role;
		this.shipHullSize = shipHullSize;
		this.shipWindows = shipWindows;
		this.shipGuns = shipGuns;

		this.hull = hull;
		this.armor = armor;
		this.maxSpeed = maxSpeed;
		this.acc = acc;
		this.accDelay = accDelay;
		this.turnDelay = turnDelay;
		this.fireDelay = fireDelay;
		this.cannonsRange = cannonsRange;
		this.cannonsDamage = cannonsDamage;

		if (shipHullSize == ShipHullSize.MEDIUM) {
			shapeWidth = 300;
			shapeHeight = 120;
		}
	}

	// -----------------------
	// Movement
	// -----------------------

	private function checkMovementInput() {
		final now = haxe.Timer.stamp();

		if (lastMovementInputCheck == 0 || lastMovementInputCheck + accDelay < now) {
			lastMovementInputCheck = now;
			return true;
		} else {
			return false;
		}
	}

	private function checkRotationInput() {
		final now = haxe.Timer.stamp();

		if (lastRotationInputCheck == 0 || lastRotationInputCheck + turnDelay < now) {
			lastRotationInputCheck = now;
			return true;
		} else {
			return false;
		}
	}

	public function accelerate() {
		if (checkMovementInput()) {
			currentSpeed += acc;
			if (currentSpeed > maxSpeed)
				currentSpeed = maxSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
			return true;
		} else {
			return false;
		}
	}

	public function decelerate() {
		if (checkMovementInput()) {
			currentSpeed -= acc;
			if (currentSpeed < minSpeed)
				currentSpeed = minSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
			return true;
		} else {
			return false;
		}
	}

	public function rotateLeft() {
		if (checkRotationInput()) {
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
			if (directionChangeCallbackLeft != null) {
				directionChangeCallbackLeft(direction);
			}
			return true;
		} else {
			return false;
		}
	}

	public function rotateRight() {
		if (checkRotationInput()) {
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
			if (directionChangeCallbackRight != null) {
				directionChangeCallbackRight(direction);
			}
			return true;
		} else {
			return false;
		}
	}

	// -----------------------
	// Battle
	// -----------------------

	public function shootAllowanceBySide(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == Right) {
			return lastRightShootInputCheck == 0 || lastRightShootInputCheck + fireDelay < now;
		} else {
			return lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + fireDelay < now;
		}
	}

	public function tryShoot(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == Right) {
			if (lastRightShootInputCheck == 0 || lastRightShootInputCheck + fireDelay < now) {
				lastRightShootInputCheck = now;
				if (shootRightCallback != null) {
					shootRightCallback();
				}
				return true;
			} else {
				return false;
			}
		} else {
			if (lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + fireDelay < now) {
				lastLeftShootInputCheck = now;
				if (shootLeftCallback != null) {
					shootLeftCallback();
				}
				return true;
			} else {
				return false;
			}
		}
	}

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
		var offset:PosOffsetArray;

		if (shipHullSize == ShipHullSize.MEDIUM) {
			offset = side == Side.Left ? EngineShipEntity.LeftCanonsOffsetByDirMid.get(direction) : EngineShipEntity.RightCanonsOffsetByDirMid.get(direction);
		} else {
			offset = side == Side.Left ? EngineShipEntity.LeftCanonsOffsetByDirSm.get(direction) : EngineShipEntity.RightCanonsOffsetByDirSm.get(direction);
		}

		var offsetX = offset.one.x;
		var offsetY = offset.one.y;

		if (index == 1) {
			offsetX = offset.two.x;
			offsetY = offset.two.y;
		} else if (index == 2) {
			offsetX = offset.three.x;
			offsetY = offset.three.y;
		}

		final resultX = x + offsetX;
		final resultY = y + offsetY;

		return {
			x: x + offsetX,
			y: y + offsetY
		}
	}
}
