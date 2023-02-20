package game.engine.entity;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;

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

	public function new(baseObjectEntity:BaseObjectEntity) {
		super(GameEntityType.Character, baseObjectEntity);

		// This is needed because char files are not cropped
		shape.rectOffsetX = 60;
		shape.rectOffsetY = 60;
	}

	public function moveUp(revert = false) {
		if (revert) {
			accelerateUp();
			return true;
		} else {
			if (checkMovementInput()) {
				accelerateDown();
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveDown(revert = false) {
		if (revert) {
			accelerateDown();
			return true;
		} else {
			if (checkMovementInput()) {
				accelerateUp();
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveLeft(revert = false) {
		if (revert) {
			accelerateLeft();
			return true;
		} else {
			if (checkMovementInput()) {
				accelerateRight();
				return true;
			} else {
				return false;
			}
		}
	}

	public function moveRight(revert = false) {
		if (revert) {
			accelerateRight();
			return true;
		} else {
			if (checkMovementInput()) {
				accelerateLeft();
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
