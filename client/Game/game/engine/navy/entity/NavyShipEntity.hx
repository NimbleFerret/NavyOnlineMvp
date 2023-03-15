package game.engine.navy.entity;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.EngineUtils;
import game.engine.base.MathUtils;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.geometry.Point;
import game.engine.navy.NavyTypesAndClasses;

class NavyShipEntity extends EngineBaseGameEntity {
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
	// public final shipObjectEntity:ShipObjectEntity;
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
		super(shipObjectEntity, NavyEntitiesConfig.EntityShapeByType.get(getShipTypeBySize(shipObjectEntity.shipHullSize)));

		// this.shipObjectEntity = shipObjectEntity;
		currentHull = shipObjectEntity.hull;
		currentArmor = shipObjectEntity.armor;

		switch (this.baseObjectEntity.direction) {
			case NORTH:
				setRotation(MathUtils.degreeToRads(-90));
			case NORTH_EAST:
				setRotation(MathUtils.degreeToRads(-45));
			case NORTH_WEST:
				setRotation(-MathUtils.degreeToRads(135));
			case SOUTH:
				setRotation(-MathUtils.degreeToRads(-90));
			case SOUTH_EAST:
				setRotation(-MathUtils.degreeToRads(-45));
			case SOUTH_WEST:
				setRotation(-MathUtils.degreeToRads(-135));
			case WEST:
				setRotation(-MathUtils.degreeToRads(180));
			case EAST:
				setRotation(MathUtils.degreeToRads(0));
		}
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		var result = true;
		switch (playerInputType) {
			case MOVE_UP:
				if (baseObjectEntity.currentSpeed + baseObjectEntity.acceleration > baseObjectEntity.maxSpeed) {
					result = false;
				}
			case MOVE_DOWN:
				if (baseObjectEntity.currentSpeed - baseObjectEntity.acceleration < baseObjectEntity.minSpeed) {
					result = false;
				}
			case _:
		}
		return result;
	}

	public function updateHashImpl() {
		final e = baseObjectEntity;
		final s:String = e.id + e.x + e.y + e.direction + currentArmor + currentHull;
		final hc = EngineUtils.HashString(s);
		return hc;
	}

	// -----------------------
	// Movement
	// -----------------------

	private function checkRotationInput() {
		final now = haxe.Timer.stamp();

		if (lastRotationInputCheck == 0 || lastRotationInputCheck + getShipObjectEntity().turnDelay < now) {
			lastRotationInputCheck = now;
			return true;
		} else {
			return false;
		}
	}

	public function accelerate() {
		var stateChanged = false;
		if (checkMovementInput() && baseObjectEntity.currentSpeed != baseObjectEntity.maxSpeed) {
			stateChanged = true;
			baseObjectEntity.currentSpeed += baseObjectEntity.acceleration;
			if (baseObjectEntity.currentSpeed > baseObjectEntity.maxSpeed)
				baseObjectEntity.currentSpeed = baseObjectEntity.maxSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(baseObjectEntity.currentSpeed);
			}
		}
		return stateChanged;
	}

	public function decelerate() {
		var stateChanged = false;
		if (checkMovementInput() && baseObjectEntity.currentSpeed != baseObjectEntity.minSpeed) {
			stateChanged = true;
			baseObjectEntity.currentSpeed -= baseObjectEntity.acceleration;
			if (baseObjectEntity.currentSpeed < baseObjectEntity.minSpeed)
				baseObjectEntity.currentSpeed = baseObjectEntity.minSpeed;
			if (speedChangeCallback != null) {
				speedChangeCallback(baseObjectEntity.currentSpeed);
			}
		}
		return stateChanged;
	}

	public function rotateLeft() {
		var stateChanged = false;
		if (checkRotationInput()) {
			stateChanged = true;
			decrementRotation(MathUtils.degreeToRads(45));
			switch (getShipObjectEntity().direction) {
				case EAST:
					getShipObjectEntity().direction = NORTH_EAST;
				case NORTH_EAST:
					getShipObjectEntity().direction = NORTH;
				case NORTH:
					getShipObjectEntity().direction = NORTH_WEST;
				case NORTH_WEST:
					getShipObjectEntity().direction = WEST;
				case WEST:
					getShipObjectEntity().direction = SOUTH_WEST;
				case SOUTH_WEST:
					getShipObjectEntity().direction = SOUTH;
				case SOUTH:
					getShipObjectEntity().direction = SOUTH_EAST;
				case SOUTH_EAST:
					getShipObjectEntity().direction = EAST;
			}
			if (directionChangeCallbackLeft != null) {
				directionChangeCallbackLeft(getShipObjectEntity().direction);
			}
		}
		return stateChanged;
	}

	public function rotateRight() {
		var stateChanged = false;
		if (checkRotationInput()) {
			stateChanged = true;
			incrementRotation(MathUtils.degreeToRads(45));
			switch (getShipObjectEntity().direction) {
				case EAST:
					getShipObjectEntity().direction = SOUTH_EAST;
				case SOUTH_EAST:
					getShipObjectEntity().direction = SOUTH;
				case SOUTH:
					getShipObjectEntity().direction = SOUTH_WEST;
				case SOUTH_WEST:
					getShipObjectEntity().direction = WEST;
				case WEST:
					getShipObjectEntity().direction = NORTH_WEST;
				case NORTH_WEST:
					getShipObjectEntity().direction = NORTH;
				case NORTH:
					getShipObjectEntity().direction = NORTH_EAST;
				case NORTH_EAST:
					getShipObjectEntity().direction = EAST;
			}
			if (directionChangeCallbackRight != null) {
				directionChangeCallbackRight(getShipObjectEntity().direction);
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
			return lastRightShootInputCheck == 0 || lastRightShootInputCheck + getShipObjectEntity().fireDelay < now;
		} else {
			return lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + getShipObjectEntity().fireDelay < now;
		}
	}

	public function tryShoot(side:Side) {
		final now = haxe.Timer.stamp();
		if (side == RIGHT) {
			if (lastRightShootInputCheck == 0 || lastRightShootInputCheck + getShipObjectEntity().fireDelay < now) {
				lastRightShootInputCheck = now;
				if (shootRightCallback != null) {
					shootRightCallback();
				}
				return true;
			} else {
				return false;
			}
		} else {
			if (lastLeftShootInputCheck == 0 || lastLeftShootInputCheck + getShipObjectEntity().fireDelay < now) {
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

		switch (getShipObjectEntity().shipCannons) {
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

		switch (getShipObjectEntity().shipCannons) {
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
			final spreadDegree = MathUtils.degreeToRads(getShipObjectEntity().cannonsAngleSpread / 2);
			final lineHorizontalLength = x + (side == RIGHT ? getShipObjectEntity().cannonsRange : -getShipObjectEntity().cannonsRange);

			final centralLineEndPoint = MathUtils.rotatePointAroundCenter(lineHorizontalLength, y, x, y, MathUtils.getGunRadByDir(baseObjectEntity.direction));
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

		final direction = baseObjectEntity.direction;

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

		if (getShipObjectEntity().shipHullSize == ShipHullSize.MEDIUM) {
			offset = side == Side.LEFT ? NavyEntitiesConfig.LeftCannonsOffsetByDirMid.get(direction) : NavyEntitiesConfig.RightCannonsOffsetByDirMid.get(direction);
		} else {
			offset = side == Side.LEFT ? NavyEntitiesConfig.LeftCannonsOffsetByDirSm.get(direction) : NavyEntitiesConfig.RightCannonsOffsetByDirSm.get(direction);
		}

		final offsetX = offset.positions[index].x - additionalOffsetX;
		final offsetY = offset.positions[index].y - additionalOffsetY;

		return new Point(baseObjectEntity.x + offsetX, baseObjectEntity.y + offsetY);
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

	private function getShipObjectEntity() {
		return cast(baseObjectEntity, ShipObjectEntity);
	}

	public function getShipHullSize() {
		return getShipObjectEntity().shipHullSize;
	}

	public function getHull() {
		return getShipObjectEntity().hull;
	}

	public function getArmor() {
		return getShipObjectEntity().armor;
	}

	public function getShipWindows() {
		return getShipObjectEntity().shipWindows;
	}

	public function getShipCannons() {
		return getShipObjectEntity().shipCannons;
	}

	public function getCannonsDamage() {
		return getShipObjectEntity().cannonsDamage;
	}

	public function getCannonsRange() {
		return getShipObjectEntity().cannonsRange;
	}

	public function getCannonsShellSpeed() {
		return getShipObjectEntity().cannonsShellSpeed;
	}

	public function getRole() {
		return getShipObjectEntity().role;
	}
}
