package game.engine.entity;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.geometry.Point;
import game.engine.MathUtils;

class EngineShipEntity extends EngineBaseGameEntity {
	public var role:Role;
	public var free:Bool;
	public var serverShipRef:String;

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
	public final shipObjectEntity:ShipObjectEntity;

	// -----------------------
	// Health and damage stuff
	// -----------------------
	public var currentHull = 0;
	public var currentArmor = 0;

	// -----------------------
	// Input
	// -----------------------
	private var lastRotationInputCheck = 0.0;
	private var lastLeftShootInputCheck = 0.0;
	private var lastRightShootInputCheck = 0.0;

	// Bot stuff
	public var allowShoot = false;

	// TODO implement params

	public function new(shipObjectEntity:ShipObjectEntity) {
		super(getShipTypeBySize(shipObjectEntity.shipHullSize), shipObjectEntity);

		this.shipObjectEntity = shipObjectEntity;
		currentHull = this.shipObjectEntity.hull;
		currentArmor = this.shipObjectEntity.armor;

		switch (this.shipObjectEntity.direction) {
			case North:
				rotation = MathUtils.degreeToRads(-90);
			case NorthEast:
				rotation = MathUtils.degreeToRads(-45);
			case NorthWest:
				rotation -= MathUtils.degreeToRads(135);
			case South:
				rotation -= MathUtils.degreeToRads(-90);
			case SouthEast:
				rotation -= MathUtils.degreeToRads(-45);
			case SouthWest:
				rotation -= MathUtils.degreeToRads(-135);
			case West:
				rotation -= MathUtils.degreeToRads(180);
			case East:
				rotation = MathUtils.degreeToRads(0);
		}
	}

	// -----------------------
	// Movement
	// -----------------------

	private function checkRotationInput() {
		final now = haxe.Timer.stamp();

		if (lastRotationInputCheck == 0 || lastRotationInputCheck + shipObjectEntity.turnDelay < now) {
			lastRotationInputCheck = now;
			return true;
		} else {
			return false;
		}
	}

	public function accelerate() {
		if (checkMovementInput()) {
			trace('Accelerate');
			currentSpeed += shipObjectEntity.acceleration;
			if (currentSpeed > shipObjectEntity.maxSpeed)
				currentSpeed = shipObjectEntity.maxSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
		}
	}

	public function decelerate() {
		if (checkMovementInput()) {
			currentSpeed -= shipObjectEntity.acceleration;
			if (currentSpeed < shipObjectEntity.minSpeed)
				currentSpeed = shipObjectEntity.minSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
		}
	}

	public function rotateLeft() {
		if (checkRotationInput()) {
			rotation -= MathUtils.degreeToRads(45);
			switch (shipObjectEntity.direction) {
				case East:
					shipObjectEntity.direction = NorthEast;
				case NorthEast:
					shipObjectEntity.direction = North;
				case North:
					shipObjectEntity.direction = NorthWest;
				case NorthWest:
					shipObjectEntity.direction = West;
				case West:
					shipObjectEntity.direction = SouthWest;
				case SouthWest:
					shipObjectEntity.direction = South;
				case South:
					shipObjectEntity.direction = SouthEast;
				case SouthEast:
					shipObjectEntity.direction = East;
			}
			if (directionChangeCallbackLeft != null) {
				directionChangeCallbackLeft(shipObjectEntity.direction);
			}
		}
	}

	public function rotateRight() {
		if (checkRotationInput()) {
			rotation += MathUtils.degreeToRads(45);
			switch (shipObjectEntity.direction) {
				case East:
					shipObjectEntity.direction = SouthEast;
				case SouthEast:
					shipObjectEntity.direction = South;
				case South:
					shipObjectEntity.direction = SouthWest;
				case SouthWest:
					shipObjectEntity.direction = West;
				case West:
					shipObjectEntity.direction = NorthWest;
				case NorthWest:
					shipObjectEntity.direction = North;
				case North:
					shipObjectEntity.direction = NorthEast;
				case NorthEast:
					shipObjectEntity.direction = East;
			}
			if (directionChangeCallbackRight != null) {
				directionChangeCallbackRight(shipObjectEntity.direction);
			}
		}
	}

	// -----------------------
	// Battle
	// -----------------------

	public function shootAllowanceBySide(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == Right) {
			return lastRightShootInputCheck == 0 || lastRightShootInputCheck + shipObjectEntity.fireDelay < now;
		} else {
			return lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + shipObjectEntity.fireDelay < now;
		}
	}

	public function tryShoot(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == Right) {
			if (lastRightShootInputCheck == 0 || lastRightShootInputCheck + shipObjectEntity.fireDelay < now) {
				lastRightShootInputCheck = now;
				if (shootRightCallback != null) {
					shootRightCallback();
				}
				return true;
			} else {
				return false;
			}
		} else {
			if (lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + shipObjectEntity.fireDelay < now) {
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

	public function getCannonsPositionBySide(side:Side) {
		final result = new Array<Point>();
		var cannonsTotal = 0;

		switch (shipObjectEntity.shipCannons) {
			case ONE:
				cannonsTotal = 1;
			case TWO:
				cannonsTotal = 2;
			case THREE:
				cannonsTotal = 3;
			case FOUR:
				cannonsTotal = 4;
			case _:
		}

		for (i in 0...cannonsTotal) {
			final cannonPosition = getCannonPositionBySideAndIndex(side, i);
			result.push(cannonPosition);
		}

		return result;
	}

	public function getCannonsFiringAreaBySide(side:Side) {
		final result = new Array<CannonFiringRangeDetails>();
		var cannonsTotal = 0;

		switch (shipObjectEntity.shipCannons) {
			case ONE:
				cannonsTotal = 1;
			case TWO:
				cannonsTotal = 2;
			case THREE:
				cannonsTotal = 3;
			case FOUR:
				cannonsTotal = 4;
			case _:
		}

		for (i in 0...cannonsTotal) {
			final cannonPosition = getCannonPositionBySideAndIndex(side, i);

			final x = cannonPosition.x, y = cannonPosition.y;
			final spreadDegree = MathUtils.degreeToRads(shipObjectEntity.cannonsAngleSpread / 2);
			final lineHorizontalLength = x + (side == Right ? shipObjectEntity.cannonsRange : -shipObjectEntity.cannonsRange);

			final centralLineEndPoint = MathUtils.rotatePointAroundCenter(lineHorizontalLength, y, x, y, MathUtils.getGunRadByDir(shipObjectEntity.direction));
			final leftLineEndPoint = MathUtils.rotatePointAroundCenter(centralLineEndPoint.x, centralLineEndPoint.y, x, y, spreadDegree);
			final rightLineEndPoint = MathUtils.rotatePointAroundCenter(centralLineEndPoint.x, centralLineEndPoint.y, x, y, -spreadDegree);

			result.push({
				origin: cannonPosition,
				center: centralLineEndPoint,
				left: leftLineEndPoint,
				right: rightLineEndPoint
			});
		}

		return result;
	}

	public function getCannonPositionBySideAndIndex(side:Side, index:Int) {
		var offset:PosOffsetArray;

		// In order to correct position
		var additionalOffsetX = 0;
		var additionalOffsetY = 0;

		final direction = shipObjectEntity.direction;

		if (side == Side.Left) {
			if (direction == East) {
				additionalOffsetX = 0;
				additionalOffsetY = 20;
			}
			if (direction == NorthEast) {
				additionalOffsetX = 14;
				additionalOffsetY = 8;
			}
			if (direction == North) {
				additionalOffsetX = 20;
				additionalOffsetY = 0;
			}
			if (direction == NorthWest) {
				additionalOffsetX = 14;
				additionalOffsetY = -8;
			}
			if (direction == West) {
				additionalOffsetX = 0;
				additionalOffsetY = -20;
			}
			if (direction == SouthWest) {
				additionalOffsetX = -14;
				additionalOffsetY = -8;
			}
			if (direction == SouthEast) {
				additionalOffsetX = -14;
				additionalOffsetY = 8;
			}
			if (direction == South) {
				additionalOffsetX = -20;
				additionalOffsetY = 0;
			}
		} else {
			if (direction == East) {
				additionalOffsetX = 0;
				additionalOffsetY = -20;
			}
			if (direction == NorthEast) {
				additionalOffsetX = -14;
				additionalOffsetY = -8;
			}
			if (direction == North) {
				additionalOffsetX = -20;
				additionalOffsetY = 0;
			}
			if (direction == NorthWest) {
				additionalOffsetX = -14;
				additionalOffsetY = 8;
			}
			if (direction == West) {
				additionalOffsetX = 0;
				additionalOffsetY = 20;
			}
			if (direction == SouthWest) {
				additionalOffsetX = 14;
				additionalOffsetY = 8;
			}
			if (direction == SouthEast) {
				additionalOffsetX = 14;
				additionalOffsetY = -8;
			}
			if (direction == South) {
				additionalOffsetX = 20;
				additionalOffsetY = 0;
			}
		}

		if (shipObjectEntity.shipHullSize == ShipHullSize.MEDIUM) {
			offset = side == Side.Left ? EngineShipEntityConfig.LeftCannonsOffsetByDirMid.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirMid.get(direction);
		} else {
			offset = side == Side.Left ? EngineShipEntityConfig.LeftCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirSm.get(direction);
		}

		final offsetX = offset.positions[index].x - additionalOffsetX;
		final offsetY = offset.positions[index].y - additionalOffsetY;

		return new Point(shipObjectEntity.x + offsetX, shipObjectEntity.y + offsetY);
	}

	private static function getShipTypeBySize(size:ShipHullSize) {
		switch (size) {
			case SMALL:
				return GameEntityType.SmallShip;
			case MEDIUM:
				return GameEntityType.MediumShip;
			case LARGE:
				return GameEntityType.LargeShip;
		}
	}

	// -----------------------
	// Getters
	// -----------------------

	public function getShipHullSize() {
		return shipObjectEntity.shipHullSize;
	}

	public function getHull() {
		return shipObjectEntity.hull;
	}

	public function getArmor() {
		return shipObjectEntity.armor;
	}

	public function getShipWindows() {
		return shipObjectEntity.shipWindows;
	}

	public function getShipCannons() {
		return shipObjectEntity.shipCannons;
	}

	public function getCannonsDamage() {
		return shipObjectEntity.cannonsDamage;
	}

	public function getCannonsRange() {
		return shipObjectEntity.cannonsRange;
	}
}
