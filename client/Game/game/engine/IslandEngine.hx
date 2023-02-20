package game.engine;

import game.engine.BaseEngine.EngineGameMode;
import game.engine.BaseEngine.EngineMode;
import game.engine.geometry.Line;
import game.engine.entity.EngineCharacterEntity;
import game.engine.entity.manager.CharacterManager;

@:expose
class IslandEngine extends BaseEngine {
	public final lineColliders = new Array<Line>();

	public static function main() {}

	public function new(engineMode = EngineMode.Server) {
		super(engineMode, EngineGameMode.Island, new CharacterManager());

		addLineCollider(1462, 132, 1293, 115);
		addLineCollider(1293, 115, 1274, 62);
		addLineCollider(1274, 62, 1207, 52);
		addLineCollider(1207, 52, 1206, -8);
		addLineCollider(1206, -8, 1070, -14);
		addLineCollider(1070, -14, 1065, -78);
		addLineCollider(1065, -78, 823, -88);
		addLineCollider(823, -88, 718, -9);
		addLineCollider(718, -9, 465, -15);
		addLineCollider(465, -15, 303, 146);
		addLineCollider(303, 146, 289, 202);
		addLineCollider(289, 202, 96, 204);
		addLineCollider(1463, 134, 1620, -15);
		addLineCollider(1620, -15, 1692, -15);
		addLineCollider(1692, -15, 1836, -12);
		addLineCollider(1836, -12, 2002, 151);
		addLineCollider(2002, 151, 2000, 309);
		addLineCollider(2000, 309, 1921, 317);
		addLineCollider(1921, 317, 1918, 346);
		addLineCollider(1918, 346, 1909, 479);
		addLineCollider(1909, 479, 1915, 592);
		addLineCollider(1915, 592, 1905, 667);
		addLineCollider(1905, 667, 1425, 670);
		addLineCollider(1425, 670, 1412, 675);
		addLineCollider(1412, 675, 1404, 742);
		addLineCollider(1404, 742, 1046, 746);
		addLineCollider(1046, 746, 1041, 667);
		addLineCollider(1041, 667, 835, 668);
		addLineCollider(835, 668, 829, 813);
		addLineCollider(829, 813, 619, 813);
		addLineCollider(619, 813, 613, 739);
		addLineCollider(613, 739, 464, 736);
		addLineCollider(464, 736, 465, 663);
		addLineCollider(465, 663, 180, 660);
		addLineCollider(180, 660, 174, 596);
		addLineCollider(174, 596, 114, 590);
		addLineCollider(114, 590, 112, 537);
		addLineCollider(112, 537, 347, 530);
		addLineCollider(347, 530, 345, 287);
		addLineCollider(345, 287, 109, 281);
		addLineCollider(109, 281, 96, 206);
	}

	public function engineLoopUpdate(dt:Float) {
		for (character in mainEntityManager.entities) {
			character.collides(false);
			character.update(dt);

			final char = cast(character, EngineCharacterEntity);

			if (char.wantToMoveLeft) {
				char.moveLeft();
			}
			if (char.wantToMoveRight) {
				char.moveRight();
			}
			if (char.wantToMoveUp) {
				char.moveUp();
			}
			if (char.wantToMoveDown) {
				char.moveDown();
			}

			var revertMovement = false;

			for (lineCollider in lineColliders) {
				if (character.getBodyRectangle().intersectsWithLine(lineCollider)) {
					character.collides(true);
					revertMovement = true;
				}
			}

			if (revertMovement) {
				if (char.wantToMoveLeft) {
					char.moveLeft(true);
				}
				if (char.wantToMoveRight) {
					char.moveRight(true);
				}
				if (char.wantToMoveUp) {
					char.moveUp(true);
				}
				if (char.wantToMoveDown) {
					char.moveDown(true);
				}
			}

			char.wantToMoveLeft = false;
			char.wantToMoveRight = false;
			char.wantToMoveUp = false;
			char.wantToMoveDown = false;
		}
	}

	public function customDelete() {}

	public function addLineCollider(x1:Int, y1:Int, x2:Int, y2:Int) {
		lineColliders.push(new Line(x1, y1, x2, y2));
	}

	public function entityMoveUp(id:String) {
		final character = cast(mainEntityManager.getEntityById(id), EngineCharacterEntity);
		if (character != null && character.moveUp()) {
			character.wantToMoveUp = true;
			return true;
		} else {
			return false;
		}
	}

	public function entityMoveDown(id:String) {
		final character = cast(mainEntityManager.getEntityById(id), EngineCharacterEntity);
		if (character != null && character.moveDown()) {
			character.wantToMoveDown = true;
			return true;
		} else {
			return false;
		}
	}

	public function entityMoveLeft(id:String) {
		final character = cast(mainEntityManager.getEntityById(id), EngineCharacterEntity);
		if (character != null && character.moveLeft()) {
			character.wantToMoveLeft = true;
			return true;
		} else {
			return false;
		}
	}

	public function entityMoveRight(id:String) {
		final character = cast(mainEntityManager.getEntityById(id), EngineCharacterEntity);
		if (character != null && character.moveRight()) {
			character.wantToMoveRight = true;
			return true;
		} else {
			return false;
		}
	}
}
