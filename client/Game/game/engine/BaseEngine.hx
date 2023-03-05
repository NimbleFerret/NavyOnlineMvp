package game.engine;

import game.engine.GameLoop;
import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.TypesAndClasses;
import game.engine.entity.manager.BaseEntityManager;

enum EngineMode {
	Client;
	Server;
}

enum EngineGameMode {
	Island;
	Sea;
}

typedef PlayerInputCommandEngineWrapped = {
	var playerInputCommand:PlayerInputCommand;
	var tick:Int;
}

@:expose
abstract class BaseEngine {
	final gameLoop:GameLoop;

	public var tick:Int;

	public final engineMode:EngineMode;
	public final engineGameMode:EngineGameMode;

	public var tickCallback:Void->Void;
	public var createMainEntityCallback:EngineBaseGameEntity->Void;
	public var deleteMainEntityCallback:EngineBaseGameEntity->Void;

	public final mainEntityManager:BaseEntityManager;
	public final playerEntityMap = new Map<String, String>();

	// Команды от пользователей, которые будут применены в начале каждого тика
	private var hotInputCommands = new Array<PlayerInputCommandEngineWrapped>();

	// История команд за последние N тиков
	public var ticksSinceLastPop = 0;
	public final coldInputCommandsTreshhold = 10;
	public final coldInputCommands = new Array<PlayerInputCommandEngineWrapped>();

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

			// Apply inputs
			processInputCommands(hotInputCommands);
			hotInputCommands = [];

			// Update all entities
			engineLoopUpdate(dt);

			if (tickCallback != null) {
				tickCallback();
			}
		});
	}

	// -----------------------------------
	// Abstract functions
	// -----------------------------------

	public abstract function processInputCommands(playerInputCommands:Array<PlayerInputCommandEngineWrapped>):Void;

	public abstract function engineLoopUpdate(dt:Float):Void;

	public abstract function customDelete():Void;

	public abstract function buildEngineEntity(struct:Dynamic):EngineBaseGameEntity;

	// -----------------------------------
	// Main entity management
	// -----------------------------------

	public function createMainEntity(entity:EngineBaseGameEntity, fireCallback = false) {
		mainEntityManager.add(entity);
		playerEntityMap.set(entity.getOwnerId(), entity.getId());
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
			playerEntityMap.remove(entity.getOwnerId());
			mainEntityManager.remove(entity.getId());
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
			hotInputCommands.push({
				playerInputCommand: playerInputCommand,
				tick: tick
			});
			coldInputCommands.push({
				playerInputCommand: playerInputCommand,
				tick: tick
			});
		}
	}

	// -----------------------------------
	// General
	// -----------------------------------

	public function destroy() {
		gameLoop.stopLoop();

		mainEntityManager.destroy();

		tickCallback = null;
		createMainEntityCallback = null;
		deleteMainEntityCallback = null;

		customDelete();
	}
}
