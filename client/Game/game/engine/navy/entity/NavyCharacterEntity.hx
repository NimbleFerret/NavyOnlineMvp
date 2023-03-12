package game.engine.navy.entity;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.navy.NavyTypesAndClasses;

enum CurrentState {
	Idle;
	Moving;
}

class NavyCharacterEntity extends EngineBaseGameEntity {
	public var lastMovementDirection:PlainDirection;
	public var blockedMovementDirection:PlainDirection;

	public function new(baseObjectEntity:BaseObjectEntity) {
		super(baseObjectEntity, NavyEntitiesConfig.EntityShapeByType.get(GameEntityType.CHARACTER));

		// This is needed because char files are not cropped
		shape.rectOffsetX = 60;
		shape.rectOffsetY = 60;
	}

	// ------------------------------------------------
	// Abstract
	// ------------------------------------------------

	public function canMove(playerInputType:PlayerInputType) {
		return isMovable;
	}

	public function updateHashImpl() {
		return 0;
	}

	public function moveInDirection(plainDirection:PlainDirection) {
		var stateChanged = false;
		if (checkMovementInput() && canMoveIfBlocked(plainDirection)) {
			stateChanged = true;
			moveStepInDirection(plainDirection);
			lastMovementDirection = plainDirection;
		}
		return stateChanged;
	}

	public function blockMovement() {
		blockedMovementDirection = lastMovementDirection;
	}

	public function resetMovementBlock() {
		blockedMovementDirection = null;
	}

	private function canMoveIfBlocked(newDirection:PlainDirection) {
		if (blockedMovementDirection != null) {
			return blockedMovementDirection == LEFT && newDirection == RIGHT || blockedMovementDirection == RIGHT && newDirection == LEFT
				|| blockedMovementDirection == UP && newDirection == DOWN || blockedMovementDirection == DOWN && newDirection == UP;
		}
		return true;
	}
}
