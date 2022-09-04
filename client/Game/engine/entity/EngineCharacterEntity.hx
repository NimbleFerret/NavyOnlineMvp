package engine.entity;

import engine.entity.EngineBaseGameEntity;

enum CurrentState {
	Idle;
	Moving;
}

class EngineCharacterEntity extends EngineBaseGameEntity {
	private var lastMovementInputCheck = 0.0;
	private var inputMovementCheckDelayMS = 0.1;

	public var wantToMoveLeft = false;
	public var wantToMoveRight = false;
	public var wantToMoveUp = false;
	public var wantToMoveDown = false;

	public function new(x:Float, y:Float, ?id:String, ?ownerId:String) {
		super(GameEntityType.Character, x, y, 0, id, ownerId);

		// This is needed because char files are not cropped
		rectOffsetX = 40;
		rectOffsetY = 40;

		speedStep = 20;
	}

	public function moveUp(revert = false) {
		if (revert) {
			y += speedStep;
			return true;
		} else {
			if (checkMovementInput()) {
				y -= speedStep;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveDown(revert = false) {
		if (revert) {
			y -= speedStep;
			return true;
		} else {
			if (checkMovementInput()) {
				y += speedStep;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveLeft(revert = false) {
		if (revert) {
			x += speedStep;
			return true;
		} else {
			if (checkMovementInput()) {
				x -= speedStep;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveRight(revert = false) {
		if (revert) {
			x -= speedStep;
			return true;
		} else {
			if (checkMovementInput()) {
				x += speedStep;
				return true;
			} else {
				return false;
			}
		}
	}

	public function checkMovementInput() {
		final now = haxe.Timer.stamp();

		if (lastMovementInputCheck == 0 || lastMovementInputCheck + inputMovementCheckDelayMS < now) {
			lastMovementInputCheck = now;
			return true;
		} else {
			return false;
		}
	}
}
