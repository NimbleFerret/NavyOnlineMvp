package engine;

import engine.entity.manager.CharacterManager;
import engine.entity.EngineCharacterEntity;
import engine.entity.EngineGameRect;
import engine.MathUtils;
import engine.GameLoop;
import uuid.Uuid;

@:expose
class IslandEngine {
	final gameLoop:GameLoop;

	public var tick:Int;

	public final characterManager:CharacterManager;

	private final playerCharacterMap = new Map<String, String>();
	private final colliders = new Array<EngineGameRect>();

	public function new() {
		characterManager = new CharacterManager();

		gameLoop = new GameLoop(function loop(dt:Float, tick:Int) {
			this.tick = tick;

			for (character in characterManager.entities) {
				character.collides(false);
				character.update(dt);

				for (collider in colliders) {
					if (collider.intersectsWithRect(character.getGameRect())) {
						character.collides(true);
						trace('Collides');
					}
				}
			}
		});
	}

	public function addCollider(x:Int, y:Int, w:Int, h:Int) {
		final collider = new EngineGameRect(x, y, w, h, 0);
		colliders.push(collider);
	}

	public function addCharacter(character:EngineCharacterEntity) {
		characterManager.add(character);
		playerCharacterMap.set(character.ownerId, character.id);
	}

	public static function main() {}

	public static function GenerateId() {
		return Uuid.short();
	}
}
