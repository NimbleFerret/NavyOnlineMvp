package game.engine.base.core;

import game.engine.base.BaseTypesAndClasses;
import game.engine.base.core.GameLoop;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.entity.manager.BaseEntityManager;

enum EngineMode {
	Client;
	Server;
}

enum EngineGameMode {
	Island;
	Sea;
}

typedef CreateMainEntityTask = {
	var fireCallback:Bool;
	var entity:EngineBaseGameEntity;
}

@:expose
abstract class BaseEngine {
	final gameLoop:GameLoop;

	public var tick:Int;

	public var recentEngineLoopTime:Float;
	public final okLoopTime:Int;
	public final engineMode:EngineMode;
	public final engineGameMode:EngineGameMode;

	public var postLoopCallback:Void->Void;
	public var createMainEntityCallback:EngineBaseGameEntity->Void;
	public var deleteMainEntityCallback:EngineBaseGameEntity->Void;

	public final mainEntityManager:BaseEntityManager;
	public final playerEntityMap = new Map<String, String>();

	public var validatedInputCommands = new Array<PlayerInputCommand>();

	private var addMainEntityQueue = new Array<CreateMainEntityTask>();
	private var removeMainEntityQueue = new Array<String>();

	// Команды от пользователей, которые будут применены в начале каждого тика
	private var hotInputCommands = new Array<InputCommandEngineWrapped>();

	// История команд за последние N тиков
	public var ticksSinceLastPop = 0;
	public final coldInputCommandsTreshhold = 10;
	public final coldInputCommands = new Array<InputCommandEngineWrapped>();

	public function new(engineMode = EngineMode.Server, engineGameMode:EngineGameMode, mainEntityManager:BaseEntityManager) {
		this.engineMode = engineMode;
		this.engineGameMode = engineGameMode;
		this.mainEntityManager = mainEntityManager;

		gameLoop = new GameLoop(function loop(dt:Float, tick:Int) {
			this.tick = tick;

			// Remove outdated inputs from cache
			if (ticksSinceLastPop == coldInputCommandsTreshhold) {
				ticksSinceLastPop = 0;
				coldInputCommands.shift();
			}
			ticksSinceLastPop++;

			processCreateEntityQueue();
			processRemoveEntityQueue();

			// Apply inputs
			processInputCommands(hotInputCommands);
			hotInputCommands = [];

			// Update all entities
			engineLoopUpdate(dt);

			if (postLoopCallback != null) {
				postLoopCallback();
			}
			validatedInputCommands = [];
		});

		okLoopTime = Std.int(1000 / gameLoop.targetFps);
	}

	// -----------------------------------
	// Abstract functions
	// -----------------------------------

	public abstract function processInputCommands(playerInputCommands:Array<InputCommandEngineWrapped>):Void;

	public abstract function engineLoopUpdate(dt:Float):Void;

	public abstract function customDestroy():Void;

	public abstract function buildEngineEntity(struct:Dynamic):EngineBaseGameEntity;

	// -----------------------------------
	// Main entity management
	// -----------------------------------

	public function createMainEntity(entity:EngineBaseGameEntity, fireCallback = false) {
		addMainEntityQueue.push({
			entity: entity,
			fireCallback: fireCallback
		});
	}

	public function removeMainEntity(entityId:String) {
		removeMainEntityQueue.push(entityId);
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

	private function processCreateEntityQueue() {
		for (queueTask in addMainEntityQueue) {
			mainEntityManager.add(queueTask.entity);
			playerEntityMap.set(queueTask.entity.getOwnerId(), queueTask.entity.getId());
			if (queueTask.fireCallback) {
				if (createMainEntityCallback != null) {
					createMainEntityCallback(queueTask.entity);
				}
			}
		}
		addMainEntityQueue = [];
	}

	private function processRemoveEntityQueue() {
		for (entityId in removeMainEntityQueue) {
			final entity = mainEntityManager.getEntityById(entityId);
			if (entity != null) {
				if (deleteMainEntityCallback != null) {
					deleteMainEntityCallback(entity);
				}
				playerEntityMap.remove(entity.getOwnerId());
				mainEntityManager.remove(entity.getId());
			}
		}
		removeMainEntityQueue = [];
	}

	// -----------------------------------
	// Input
	// -----------------------------------

	public function checkLocalMovementInputAllowance(entityId:String, playerInputType:PlayerInputType) {
		final entity = mainEntityManager.getEntityById(entityId);
		if (entity == null) {
			return false;
		} else {
			return entity.checkLocalMovementInput() && entity.canMove(playerInputType);
		}
	}

	public function addInputCommand(playerInputCommand:PlayerInputCommand) {
		if (playerInputCommand.inputType != null && playerInputCommand.playerId != null) {
			final wrappedCommand = new InputCommandEngineWrapped(playerInputCommand, tick);
			hotInputCommands.push(wrappedCommand);
			coldInputCommands.push(wrappedCommand);
		}
	}

	// -----------------------------------
	// General
	// -----------------------------------

	public function destroy() {
		gameLoop.stopLoop();

		mainEntityManager.destroy();

		postLoopCallback = null;
		createMainEntityCallback = null;
		deleteMainEntityCallback = null;

		customDestroy();
	}
}
