package engine.entity.manager;

import engine.entity.EngineBaseGameEntity;
import js.lib.Map;

class BaseEntityManager {
	// TODO use common map, not js one
	public final entities = new js.lib.Map<String, EngineBaseGameEntity>();

	private var updateCallback:Null<EngineBaseGameEntity->Void>;

	public function destroy() {
		entities.clear();
		updateCallback = null;
	}

	public function add(entity:EngineBaseGameEntity) {
		entities.set(entity.id, entity);
	}

	public function remove(id:String) {
		entities.delete(id);
	}

	public function getEntityById(id:String) {
		return entities.get(id);
	}
}
