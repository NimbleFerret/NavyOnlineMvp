package client.gameplay;

import client.entity.ClientShip;
import client.entity.ClientCharacter;
import client.entity.ClientBaseGameEntity;
import client.network.Socket;
import client.network.SocketProtocol;
import engine.BaseEngine;
import engine.GameEngine;
import engine.IslandEngine;
import engine.entity.EngineBaseGameEntity;
import engine.entity.EngineShipEntity;
import hxd.Key in K;

enum GameState {
	Init;
	Playing;
	Died;
	Dock;
	Land;
}

abstract class BasicGameplay {
	public final baseEngine:BaseEngine;

	public var gameState = GameState.Init;

	public var playerId:String;
	public var playerEntityId:String;

	final clientMainEntities = new Map<String, ClientBaseGameEntity>();
	var clientMainEntitiesCount = 0;

	private final scene:h2d.Scene;

	public function new(scene:h2d.Scene, baseEngine:BaseEngine) {
		this.scene = scene;
		this.baseEngine = baseEngine;
	}

	public function destroy() {
		baseEngine.destroy();
	}

	public function update(dt:Float, fps:Float) {
		if (gameState == GameState.Playing) {
			updateInput();

			customUpdate(dt, fps);

			final playerEntity = getPlayerEntity();
			if (playerEntity != null) {
				scene.camera.x = hxd.Math.lerp(scene.camera.x, playerEntity.x, 0.1);
				scene.camera.y = hxd.Math.lerp(scene.camera.y, playerEntity.y, 0.1);
			}
		}
	}

	private function getPlayerEntity() {
		return clientMainEntities.get(playerEntityId);
	}

	private function updateInput() {
		final left = K.isDown(K.LEFT);
		final right = K.isDown(K.RIGHT);
		final up = K.isDown(K.UP);
		final down = K.isDown(K.DOWN);

		var movementChanged = false;
		if (left)
			movementChanged = moveLeft(playerEntityId);
		if (right)
			movementChanged = moveRight(playerEntityId);
		if (up)
			movementChanged = moveUp(playerEntityId);
		if (down)
			movementChanged = moveDown(playerEntityId);

		if (movementChanged && (up || down || left || right)) {
			Socket.instance.move({
				playerId: playerId,
				up: up,
				down: down,
				left: left,
				right: right
			});
		}

		customInput();
	}

	public abstract function customUpdate(dt:Float, fps:Float):Void;

	public abstract function customInput():Void;

	public abstract function customUpdateWorldState():Void;

	public abstract function customSync():Void;

	public abstract function customStartGame():Void;

	// --------------------------------------
	// Online
	// --------------------------------------

	public function startGame(playerId:String, message:SocketServerMessageGameInit) {
		if (gameState == GameState.Init) {
			final entities = jsEntitiesToEngineEntities(message.entities);

			for (entity in entities) {
				createNewEntity(entity);

				if (entity.ownerId == playerId) {
					playerEntityId = entity.id;
				}
			}
			this.playerId = playerId;
			gameState = GameState.Playing;

			customStartGame();
		}
	}

	public function addEntity(message:SocketServerMessageAddEntity) {
		if (gameState == GameState.Playing) {
			final entity = jsEntityToEngineEntity(message.entitiy);

			if (!clientMainEntities.exists(entity.id)) {
				createNewEntity(entity);
			}
		}
	}

	public function entityMove(message:SocketServerMessageEntityMove) {
		if (gameState == GameState.Playing && playerEntityId != message.entityId) {
			if (playerEntityId != message.entityId) {
				if (message.up)
					moveUp(message.entityId);
				if (message.down)
					moveDown(message.entityId);
				if (message.left)
					moveLeft(message.entityId);
				if (message.right)
					moveRight(message.entityId);
			}
		}
	}

	public function removeEntity(message:SocketServerMessageRemoveEntity) {
		if (gameState == GameState.Playing) {
			baseEngine.removeMainEntity(message.entityId);
		}
	}

	public function updateWorldState(message:SocketServerMessageUpdateWorldState) {
		if (gameState == GameState.Playing) {
			for (entity in message.entities) {
				final clientEntity = clientMainEntities.get(entity.id);
				if (clientEntity != null) {
					customUpdateWorldState();

					final distanceBetweenServerAndClient = hxd.Math.distance(entity.x - clientEntity.x, entity.y - clientEntity.y);
					if (distanceBetweenServerAndClient >= 50) {
						clientEntity.updateEntityPosition(entity.x, entity.y);
					}
				}
			}
			if (message.entities.length != clientMainEntitiesCount) {
				Socket.instance.sync({
					playerId: playerId
				});
			}
		}
	}

	public function sync(message:SocketServerMessageSync) {
		if (gameState == GameState.Playing) {
			for (entity in message.entities) {
				final clientEntity = clientMainEntities.get(entity.id);
				if (clientEntity != null) {
					customSync();

					clientEntity.updateEntityPosition(entity.x, entity.y);
				} else {
					final newEntity = jsEntityToEngineEntity(entity);
					createNewEntity(newEntity);
				}
			}
		}
	}

	// --------------------------------------
	// Abstract impl
	// --------------------------------------

	private function moveUp(entityId:String) {
		return baseEngine.entityMoveUp(entityId);
	}

	private function moveDown(entityId:String) {
		return baseEngine.entityMoveDown(entityId);
	}

	private function moveLeft(entityId:String) {
		return baseEngine.entityMoveLeft(entityId);
	}

	private function moveRight(entityId:String) {
		return baseEngine.entityMoveRight(entityId);
	}

	private function createNewEntity(entity:EngineBaseGameEntity) {
		var newClientEntity:Null<ClientBaseGameEntity> = null;

		if (baseEngine.mainEntityType == GameEntityType.Ship) {
			final gameEngine = cast(baseEngine, GameEngine);
			final shipEntity = cast(entity, EngineShipEntity);

			final newEngineEnity = gameEngine.createEntity(Role.General, shipEntity.x, shipEntity.y, shipEntity.shipHullSize, shipEntity.shipWindows,
				shipEntity.shipGuns, shipEntity.id, shipEntity.ownerId);

			newClientEntity = new ClientShip(scene, newEngineEnity);
		} else if (baseEngine.mainEntityType == GameEntityType.Character) {
			final islandEngine = cast(baseEngine, IslandEngine);
			final newEngineEnity = islandEngine.createEntity(entity.x, entity.y, entity.id, entity.ownerId);

			newClientEntity = new ClientCharacter(scene, Utils.MaskEthAddress(entity.ownerId), newEngineEnity);
		}

		if (newClientEntity != null) {
			clientMainEntities.set(entity.id, newClientEntity);
			clientMainEntitiesCount++;
		}
	}

	// --------------------------------------
	// Utils
	// --------------------------------------

	public abstract function jsEntityToEngineEntity(message:Dynamic):EngineBaseGameEntity;

	public abstract function jsEntitiesToEngineEntities(message:Dynamic):Array<EngineBaseGameEntity>;
}
