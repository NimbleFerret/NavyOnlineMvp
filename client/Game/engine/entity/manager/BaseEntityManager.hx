package engine.entity.manager;

import engine.entity.EngineBaseGameEntity;

class BaseEntityManager {
	public final entities:Map<String, EngineBaseGameEntity> = [];

	private var updateCallback:Null<EngineBaseGameEntity->Void>;

	public function add(entity:EngineBaseGameEntity) {
		entities.set(entity.id, entity);
	}

	public function remove(id:String) {
		entities.remove(id);
	}

	public function getEntityById(id:String) {
		return entities.get(id);
	}
}
