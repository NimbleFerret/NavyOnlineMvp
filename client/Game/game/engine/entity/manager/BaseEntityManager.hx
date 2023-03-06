package game.engine.entity.manager;

import game.engine.entity.EngineBaseGameEntity;
import js.lib.Map;

class BaseEntityManager {
	public final entities = new js.lib.Map<String, EngineBaseGameEntity>();

	private var updateCallback:Null<EngineBaseGameEntity->Void>;

	public function destroy() {
		entities.clear();
		updateCallback = null;
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
