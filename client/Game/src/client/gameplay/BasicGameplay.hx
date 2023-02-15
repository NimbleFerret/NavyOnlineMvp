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
import hxd.Window;
import h2d.col.Point;

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

	public var maxDragX = 300;
	public var maxDragY = 300;

	final clientMainEntities = new Map<String, ClientBaseGameEntity>();
	var clientMainEntitiesCount = 0;

	private final scene:h2d.Scene;

	private var isDragging = false;
	private var dragMousePosStart:Point;
	private var currentDrag = new Point(0, 0);

	public function new(scene:h2d.Scene, baseEngine:BaseEngine) {
		this.scene = scene;
		this.baseEngine = baseEngine;

		scene.camera.x = 700;
		scene.camera.y = 300;
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
				// scene.camera.x = hxd.Math.lerp(scene.camera.x, playerEntity.x, 0.1);
				scene.camera.x = hxd.Math.lerp(scene.camera.x, playerEntity.x, 0.1) - (currentDrag.x * 0.5);
				// scene.camera.y = hxd.Math.lerp(scene.camera.y, playerEntity.y, 0.1);
				scene.camera.y = hxd.Math.lerp(scene.camera.y, playerEntity.y, 0.1) - (currentDrag.y * 0.5);
			}
		}
	}

	private function getPlayerEntity() {
		return clientMainEntities.get(playerEntityId);
	}

	private function updateInput() {
		if (isDragging) {
			final newMousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			currentDrag.x = newMousePos.x - dragMousePosStart.x;
			currentDrag.y = newMousePos.y - dragMousePosStart.y;

			final currentDragX = Math.abs(currentDrag.x);
			final currentDragY = Math.abs(currentDrag.y);
			if (currentDragX > maxDragX) {
				currentDrag.x = currentDrag.x > 0 ? maxDragX : -maxDragX;
			}
			if (currentDragY > maxDragY) {
				currentDrag.y = currentDrag.y > 0 ? maxDragY : -maxDragY;
			}
		}

		if (!isDragging && hxd.Key.isDown(hxd.Key.MOUSE_RIGHT)) {
			isDragging = true;
			dragMousePosStart = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			currentDrag.x = 0;
			currentDrag.y = 0;
		}

		if (isDragging && !hxd.Key.isDown(hxd.Key.MOUSE_RIGHT)) {
			isDragging = false;
			currentDrag.x = 0;
			currentDrag.y = 0;
		}

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

				if (entity.ownerId.toLowerCase() == playerId) {
					playerEntityId = entity.id;
				}
			}
			this.playerId = playerId;
			gameState = GameState.Playing;

			trace("startGame");
			customStartGame();
		}
	}

	public function addEntity(message:SocketServerMessageAddEntity) {
		if (gameState == GameState.Playing) {
			final entity = jsEntityToEngineEntity(message.entity);

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

			final newEngineEnity = gameEngine.createEntity('', shipEntity.free, shipEntity.role, shipEntity.x, shipEntity.y, shipEntity.shipHullSize,
				shipEntity.shipWindows, shipEntity.shipGuns, shipEntity.cannonsRange, shipEntity.cannonsDamage, shipEntity.armor, shipEntity.hull,
				shipEntity.maxSpeed, shipEntity.acc, shipEntity.accDelay, shipEntity.turnDelay, shipEntity.fireDelay, shipEntity.id, shipEntity.ownerId);

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
