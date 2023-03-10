package game.engine.navy.entity;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.navy.NavyTypesAndClasses;

enum CurrentState {
	Idle;
	Moving;
}

class NavyCharacterEntity extends EngineBaseGameEntity {
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
		return true;
	}

	public function updateHashImpl() {
		return 0;
	}

	public function moveInDirection(plainDirection:PlainDirection) {
		var stateChanged = false;
		if (checkMovementInput()) {
			stateChanged = true;
			moveStepInDirection(plainDirection);
		}
		return stateChanged;
	}
}
