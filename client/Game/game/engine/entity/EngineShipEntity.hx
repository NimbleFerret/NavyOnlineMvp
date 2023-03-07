package game.engine.entity;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.geometry.Point;
import game.engine.MathUtils;

class EngineShipEntity extends EngineBaseGameEntity {
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

	public function new(shipObjectEntity:ShipObjectEntity) {
		super(getShipTypeBySize(shipObjectEntity.shipHullSize), shipObjectEntity);

		this.shipObjectEntity = shipObjectEntity;
		currentHull = this.shipObjectEntity.hull;
		currentArmor = this.shipObjectEntity.armor;

		switch (this.shipObjectEntity.direction) {
			case NORTH:
				rotation = MathUtils.degreeToRads(-90);
			case NORTH_EAST:
				rotation = MathUtils.degreeToRads(-45);
			case NORTH_WEST:
				rotation -= MathUtils.degreeToRads(135);
			case SOUTH:
				rotation -= MathUtils.degreeToRads(-90);
			case SOUTH_EAST:
				rotation -= MathUtils.degreeToRads(-45);
			case SOUTH_WEST:
				rotation -= MathUtils.degreeToRads(-135);
			case WEST:
				rotation -= MathUtils.degreeToRads(180);
			case EAST:
				rotation = MathUtils.degreeToRads(0);
		}
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		var result = true;
		switch (playerInputType) {
			case MOVE_UP:
				if (currentSpeed + shipObjectEntity.acceleration > shipObjectEntity.maxSpeed) {
					result = false;
				}
			case MOVE_DOWN:
				if (currentSpeed - shipObjectEntity.acceleration < shipObjectEntity.minSpeed) {
					result = false;
				}
			case _:
		}
		return result;
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
		var stateChanged = false;
		if (checkMovementInput() && currentSpeed != shipObjectEntity.maxSpeed) {
			stateChanged = true;
			currentSpeed += shipObjectEntity.acceleration;
			if (currentSpeed > shipObjectEntity.maxSpeed)
				currentSpeed = shipObjectEntity.maxSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
		}
		return stateChanged;
	}

	public function decelerate() {
		var stateChanged = false;
		if (checkMovementInput() && currentSpeed != shipObjectEntity.minSpeed) {
			stateChanged = true;
			currentSpeed -= shipObjectEntity.acceleration;
			if (currentSpeed < shipObjectEntity.minSpeed)
				currentSpeed = shipObjectEntity.minSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(currentSpeed);
			}
		}
		return stateChanged;
	}

	public function rotateLeft() {
		var stateChanged = false;
		if (checkRotationInput()) {
			stateChanged = true;
			rotation -= MathUtils.degreeToRads(45);
			switch (shipObjectEntity.direction) {
				case EAST:
					shipObjectEntity.direction = NORTH_EAST;
				case NORTH_EAST:
					shipObjectEntity.direction = NORTH;
				case NORTH:
					shipObjectEntity.direction = NORTH_WEST;
				case NORTH_WEST:
					shipObjectEntity.direction = WEST;
				case WEST:
					shipObjectEntity.direction = SOUTH_WEST;
				case SOUTH_WEST:
					shipObjectEntity.direction = SOUTH;
				case SOUTH:
					shipObjectEntity.direction = SOUTH_EAST;
				case SOUTH_EAST:
					shipObjectEntity.direction = EAST;
			}
			if (directionChangeCallbackLeft != null) {
				directionChangeCallbackLeft(shipObjectEntity.direction);
			}
		}
		return stateChanged;
	}

	public function rotateRight() {
		var stateChanged = false;
		if (checkRotationInput()) {
			stateChanged = true;
			rotation += MathUtils.degreeToRads(45);
			switch (shipObjectEntity.direction) {
				case EAST:
					shipObjectEntity.direction = SOUTH_EAST;
				case SOUTH_EAST:
					shipObjectEntity.direction = SOUTH;
				case SOUTH:
					shipObjectEntity.direction = SOUTH_WEST;
				case SOUTH_WEST:
					shipObjectEntity.direction = WEST;
				case WEST:
					shipObjectEntity.direction = NORTH_WEST;
				case NORTH_WEST:
					shipObjectEntity.direction = NORTH;
				case NORTH:
					shipObjectEntity.direction = NORTH_EAST;
				case NORTH_EAST:
					shipObjectEntity.direction = EAST;
			}
			if (directionChangeCallbackRight != null) {
				directionChangeCallbackRight(shipObjectEntity.direction);
			}
		}
		return stateChanged;
	}

	// -----------------------
	// Battle
	// -----------------------

	public function shootAllowanceBySide(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == RIGHT) {
			return lastRightShootInputCheck == 0 || lastRightShootInputCheck + shipObjectEntity.fireDelay < now;
		} else {
			return lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + shipObjectEntity.fireDelay < now;
		}
	}

	public function tryShoot(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == RIGHT) {
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
			final lineHorizontalLength = x + (side == RIGHT ? shipObjectEntity.cannonsRange : -shipObjectEntity.cannonsRange);

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

		if (side == Side.LEFT) {
			if (direction == EAST) {
				additionalOffsetX = 0;
				additionalOffsetY = 20;
			}
			if (direction == NORTH_EAST) {
				additionalOffsetX = 14;
				additionalOffsetY = 8;
			}
			if (direction == NORTH) {
				additionalOffsetX = 20;
				additionalOffsetY = 0;
			}
			if (direction == NORTH_WEST) {
				additionalOffsetX = 14;
				additionalOffsetY = -8;
			}
			if (direction == WEST) {
				additionalOffsetX = 0;
				additionalOffsetY = -20;
			}
			if (direction == SOUTH_WEST) {
				additionalOffsetX = -14;
				additionalOffsetY = -8;
			}
			if (direction == SOUTH_EAST) {
				additionalOffsetX = -14;
				additionalOffsetY = 8;
			}
			if (direction == SOUTH) {
				additionalOffsetX = -20;
				additionalOffsetY = 0;
			}
		} else {
			if (direction == EAST) {
				additionalOffsetX = 0;
				additionalOffsetY = -20;
			}
			if (direction == NORTH_EAST) {
				additionalOffsetX = -14;
				additionalOffsetY = -8;
			}
			if (direction == NORTH) {
				additionalOffsetX = -20;
				additionalOffsetY = 0;
			}
			if (direction == NORTH_WEST) {
				additionalOffsetX = -14;
				additionalOffsetY = 8;
			}
			if (direction == WEST) {
				additionalOffsetX = 0;
				additionalOffsetY = 20;
			}
			if (direction == SOUTH_WEST) {
				additionalOffsetX = 14;
				additionalOffsetY = 8;
			}
			if (direction == SOUTH_EAST) {
				additionalOffsetX = 14;
				additionalOffsetY = -8;
			}
			if (direction == SOUTH) {
				additionalOffsetX = 20;
				additionalOffsetY = 0;
			}
		}

		if (shipObjectEntity.shipHullSize == ShipHullSize.MEDIUM) {
			offset = side == Side.LEFT ? EngineShipEntityConfig.LeftCannonsOffsetByDirMid.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirMid.get(direction);
		} else {
			offset = side == Side.LEFT ? EngineShipEntityConfig.LeftCannonsOffsetByDirSm.get(direction) : EngineShipEntityConfig.RightCannonsOffsetByDirSm.get(direction);
		}

		final offsetX = offset.positions[index].x - additionalOffsetX;
		final offsetY = offset.positions[index].y - additionalOffsetY;

		return new Point(shipObjectEntity.x + offsetX, shipObjectEntity.y + offsetY);
	}

	private static function getShipTypeBySize(size:ShipHullSize) {
		switch (size) {
			case SMALL:
				return GameEntityType.SMALL_SHIP;
			case MEDIUM:
				return GameEntityType.MEDIUM_SHIP;
			case LARGE:
				return GameEntityType.LARGE_SHIP;
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
