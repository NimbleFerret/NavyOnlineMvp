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
		rectOffsetX = 60;
		rectOffsetY = 60;

		acc = 20;
	}

	public function moveUp(revert = false) {
		if (revert) {
			y += acc;
			return true;
		} else {
			if (checkMovementInput()) {
				y -= acc;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveDown(revert = false) {
		if (revert) {
			y -= acc;
			return true;
		} else {
			if (checkMovementInput()) {
				y += acc;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveLeft(revert = false) {
		if (revert) {
			x += acc;
			return true;
		} else {
			if (checkMovementInput()) {
				x -= acc;
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveRight(revert = false) {
		if (revert) {
			x -= acc;
			return true;
		} else {
			if (checkMovementInput()) {
				x += acc;
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
