package game.engine.base.entity.manager;

import js.lib.Map;
import game.engine.base.entity.EngineBaseGameEntity;

class BaseEntityManager {
	public final entities = new js.lib.Map<String, EngineBaseGameEntity>();

	private var updateCallback:Null<EngineBaseGameEntity->Void>;

	public function destroy() {
		entities.clear();
		updateCallback = null;
	}

	public function getChangedEntities() {
		final result = new Array<EngineBaseGameEntity>();
		entities.forEach((value, key, map) -> {
			if (value.isChanged()) {
				result.push(value);
			}
		});
		return result;
	}

	public function add(entity:EngineBaseGameEntity) {
		entities.set(entity.getId(), entity);
	}

	public function remove(id:String) {
		entities.delete(id);
	}

	public function getEntityById(id:String) {
		return entities.get(id);
	}
}
