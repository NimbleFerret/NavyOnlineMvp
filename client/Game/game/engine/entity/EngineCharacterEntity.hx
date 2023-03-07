package game.engine.entity;

import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;

enum CurrentState {
	Idle;
	Moving;
}

class EngineCharacterEntity extends EngineBaseGameEntity {
	public var wantToMoveLeft = false;
	public var wantToMoveRight = false;
	public var wantToMoveUp = false;
	public var wantToMoveDown = false;

	public function new(baseObjectEntity:BaseObjectEntity) {
		super(GameEntityType.CHARACTER, baseObjectEntity);

		// This is needed because char files are not cropped
		shape.rectOffsetX = 60;
		shape.rectOffsetY = 60;
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		return true;
	}

	public function updateHashImpl() {
		return 0;
	}

	// public function moveUp(revert = false) {
	// 	if (revert) {
	// 		accelerateUp();
	// 		return true;
	// 	} else {
	// 		if (checkMovementInput()) {
	// 			accelerateDown();
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// }
	// public function moveDown(revert = false) {
	// 	if (revert) {
	// 		accelerateDown();
	// 		return true;
	// 	} else {
	// 		if (checkMovementInput()) {
	// 			accelerateUp();
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// }
	// public function moveLeft(revert = false) {
	// 	if (revert) {
	// 		accelerateLeft();
	// 		return true;
	// 	} else {
	// 		if (checkMovementInput()) {
	// 			accelerateRight();
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// }
	// public function moveRight(revert = false) {
	// 	if (revert) {
	// 		accelerateRight();
	// 		return true;
	// 	} else {
	// 		if (checkMovementInput()) {
	// 			accelerateLeft();
	// 			return true;
	// 		} else {
	// 			return false;
	// 		}
	// 	}
	// }
}
