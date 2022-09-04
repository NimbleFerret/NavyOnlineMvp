package engine;

import engine.entity.EngineBaseGameEntity;
import engine.entity.manager.BaseEntityManager;
import engine.GameLoop;

enum EngineMode {
	Client;
	Server;
}

@:expose
abstract class BaseEngine {
	final gameLoop:GameLoop;

	public var tick:Int;

	public final engineMode:EngineMode;
	public final mainEntityType:GameEntityType;

	public var tickCallback:Void->Void;
	public var createMainEntityCallback:EngineBaseGameEntity->Void;
	public var deleteMainEntityCallback:EngineBaseGameEntity->Void;

	public final mainEntityManager:BaseEntityManager;
	public final playerEntityMap = new Map<String, String>();

	public function new(engineMode = EngineMode.Server, mainEntityType:GameEntityType, mainEntityManager:BaseEntityManager) {
		this.engineMode = engineMode;
		this.mainEntityType = mainEntityType;
		this.mainEntityManager = mainEntityManager;

		gameLoop = new GameLoop(function loop(dt:Float, tick:Int) {
			this.tick = tick;

			engineLoopUpdate(dt);

			if (tickCallback != null) {
				tickCallback();
			}
		});
	}

	public abstract function engineLoopUpdate(dt:Float):Void;

	public abstract function customDelete():Void;

	public function destroy() {
		gameLoop.stopLoop();

		mainEntityManager.destroy();

		tickCallback = null;
		createMainEntityCallback = null;
		deleteMainEntityCallback = null;

		customDelete();
	}

	// -----------------------------------
	// Main entity management
	// -----------------------------------

	function createMainEntity(entity:EngineBaseGameEntity, fireCallback = false) {
		mainEntityManager.add(entity);
		playerEntityMap.set(entity.ownerId, entity.id);
		if (fireCallback) {
			if (createMainEntityCallback != null) {
				createMainEntityCallback(entity);
			}
		}
	}

	public function removeMainEntity(entityId:String) {
		final entity = mainEntityManager.getEntityById(entityId);
		if (entity != null) {
			if (deleteMainEntityCallback != null) {
				deleteMainEntityCallback(entity);
			}
			playerEntityMap.remove(entity.ownerId);
			mainEntityManager.remove(entity.id);
		}
	}

	public function getMainEntityById(id:String) {
		return mainEntityManager.getEntityById(id);
	}

	public function getMainEntityIdByOwnerId(id:String) {
		return playerEntityMap.get(id);
	}

	public function getMainEntityByOwnerId(id:String) {
		return mainEntityManager.getEntityById(playerEntityMap.get(id));
	}

	public function getMainEntities() {
		return mainEntityManager.entities;
	}

	// -----------------------------------
	// Main entity movement
	// -----------------------------------

	public abstract function entityMoveUp(id:String):Bool;

	public abstract function entityMoveDown(id:String):Bool;

	public abstract function entityMoveLeft(id:String):Bool;

	public abstract function entityMoveRight(id:String):Bool;
}
