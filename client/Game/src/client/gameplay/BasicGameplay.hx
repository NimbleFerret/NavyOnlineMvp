package client.gameplay;

import game.engine.entity.TypesAndClasses.PlayerInputType;
import game.engine.entity.EngineCharacterEntity;
import utils.Utils;
import client.entity.ClientShip;
import client.entity.ClientCharacter;
import client.entity.ClientBaseGameEntity;
import client.network.Socket;
import client.network.SocketProtocol;
import game.engine.BaseEngine;
import game.engine.GameEngine;
import game.engine.IslandEngine;
import game.engine.entity.EngineBaseGameEntity;
import game.engine.entity.EngineShipEntity;
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
	public var inputIndex = 0;

	private final debugGraphics:h2d.Graphics;
	private final GameEntityLayer = 1;
	private final DebugLayer = 2;

	public var gameState = GameState.Init;

	public var playerId:String;
	public var playerEntityId:String;

	public var maxDragX = 300;
	public var maxDragY = 300;

	final clientMainEntities = new Map<String, ClientBaseGameEntity>();
	var clientMainEntitiesCount = 0;

	public final scene:h2d.Scene;

	// debugGraphics = new h2d.Graphics(s2d);
	private var isDragging = false;
	private var dragMousePosStart:Point;
	private var currentDrag = new Point(0, 0);

	public function new(scene:h2d.Scene, baseEngine:BaseEngine) {
		this.scene = scene;
		this.baseEngine = baseEngine;
		this.debugGraphics = new h2d.Graphics();
		this.scene.add(this.debugGraphics, DebugLayer);

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
				// scene.camera.x = hxd.Math.lerp(scene.camera.x, playerEntity.x, 0.1) - (currentDrag.x * 0.5);
				// scene.camera.y = hxd.Math.lerp(scene.camera.y, playerEntity.y, 0.1);
				// scene.camera.y = hxd.Math.lerp(scene.camera.y, playerEntity.y, 0.1) - (currentDrag.y * 0.5);
			}
		}
	}

	public function debugDraw() {
		debugGraphics.clear();
		if (GameConfig.DebugDraw) {
			for (entity in clientMainEntities) {
				entity.debugDraw(debugGraphics);
			}
		}
	}

	private function getPlayerEntity() {
		return clientMainEntities.get(playerEntityId);
	}

	private function updateInput() {
		final newMousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);

		if (isDragging) {
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

		var playerInputType:PlayerInputType = null;
		if (left)
			playerInputType = PlayerInputType.MOVE_LEFT;
		if (right)
			playerInputType = PlayerInputType.MOVE_RIGHT;
		if (up)
			playerInputType = PlayerInputType.MOVE_UP;
		if (down)
			playerInputType = PlayerInputType.MOVE_DOWN;

		final xxx = baseEngine.checkLocalMovementInputAllowance(playerEntityId, playerInputType);

		if (playerInputType != null && (up || down || left || right) && xxx) {
			baseEngine.addInputCommand({
				index: ++inputIndex,
				playerId: playerId,
				inputType: playerInputType
			});

			Socket.instance.input({
				index: inputIndex,
				playerId: playerId,
				playerInputType: playerInputType
			});
		}

		customInput(newMousePos, K.isPressed(hxd.Key.MOUSE_LEFT), hxd.Key.isPressed(hxd.Key.MOUSE_RIGHT));
	}

	public abstract function customUpdate(dt:Float, fps:Float):Void;

	public abstract function customInput(mousePos:Point, mouseLeft:Bool, mouseRight:Bool):Void;

	public abstract function customUpdateWorldState():Void;

	public abstract function customSync():Void;

	public abstract function customStartGame():Void;

	// --------------------------------------
	// Simgleplayer
	// --------------------------------------

	public function startGameSingleplayer(playerId:String, entities:Array<EngineBaseGameEntity>) {
		if (gameState == GameState.Init) {
			this.playerId = playerId;
			for (entitty in entities) {
				createNewMainEntity(entitty);
			}
			gameState = GameState.Playing;
		}
	}

	// --------------------------------------
	// Multiplayer
	// --------------------------------------

	public function startGameMultiplayer(playerId:String, message:SocketServerMessageGameInit) {
		if (gameState == GameState.Init) {
			this.playerId = playerId;

			final entities = jsEntitiesToEngineEntities(message.entities);

			for (entity in entities) {
				createNewMainEntity(entity);

				if (entity.getOwnerId().toLowerCase() == playerId) {
					playerEntityId = entity.getId();
				}
			}
			gameState = GameState.Playing;

			customStartGame();
		}
	}

	public function addEntity(message:SocketServerMessageAddEntity) {
		if (gameState == GameState.Playing) {
			final entity = jsEntityToEngineEntity(message.entity);

			if (!clientMainEntities.exists(entity.getId())) {
				createNewMainEntity(entity);
			} else {
				trace('addEntity WTF?');
			}
		}
	}

	public function entityInput(message:SocketServerMessageEntityInput) {
		if (gameState == GameState.Playing && playerId != message.playerId) {
			baseEngine.addInputCommand({
				index: 0,
				playerId: message.playerId,
				inputType: message.playerInputType
			});
		}
	}

	// public function entityMove(message:SocketServerMessageEntityMove) {
	// 	if (gameState == GameState.Playing && playerEntityId != message.entityId) {
	// 		if (playerEntityId != message.entityId) {
	// 			// if (message.up)
	// 			// 	moveUp(message.entityId);
	// 			// if (message.down)
	// 			// 	moveDown(message.entityId);
	// 			// if (message.left)
	// 			// 	moveLeft(message.entityId);
	// 			// if (message.right)
	// 			// 	moveRight(message.entityId);
	// 		}
	// 	}
	// }

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
					createNewMainEntity(newEntity);
				}
			}
		}
	}

	// --------------------------------------
	// Entities manipulation
	// --------------------------------------

	function createNewMainEntity(entity:EngineBaseGameEntity) {
		var newClientEntity:Null<ClientBaseGameEntity> = null;

		if (baseEngine.engineGameMode == EngineGameMode.Sea) {
			final gameEngine = cast(baseEngine, GameEngine);
			final shipEntity = cast(entity, EngineShipEntity);
			if (shipEntity.getOwnerId() == playerId) {
				playerEntityId = shipEntity.getId();
			}
			gameEngine.createMainEntity(shipEntity, true);
			newClientEntity = new ClientShip(shipEntity);
		} else if (baseEngine.engineGameMode == EngineGameMode.Island) {
			final islandEngine = cast(baseEngine, IslandEngine);
			final islandEntity = cast(entity, EngineCharacterEntity);
			islandEngine.createMainEntity(islandEntity, true);

			var characterName = Utils.MaskEthAddress(entity.getOwnerId());
			if (islandEntity.getOwnerId() == playerId) {
				playerEntityId = islandEntity.getId();
				characterName = 'You';
			}

			newClientEntity = new ClientCharacter(characterName, islandEntity);
		}

		if (newClientEntity != null) {
			clientMainEntities.set(entity.getId(), newClientEntity);
			clientMainEntitiesCount++;
		}

		addGameEntityToScene(newClientEntity);
	}

	function addGameEntityToScene(entity:ClientBaseGameEntity) {
		scene.add(entity, GameEntityLayer);
	}

	// private function moveUp(entityId:String) {
	// 	return baseEngine.entityMoveUp(entityId);
	// }
	// private function moveDown(entityId:String) {
	// 	return baseEngine.entityMoveDown(entityId);
	// }
	// private function moveLeft(entityId:String) {
	// 	return baseEngine.entityMoveLeft(entityId);
	// }
	// private function moveRight(entityId:String) {
	// 	return baseEngine.entityMoveRight(entityId);
	// }
	// --------------------------------------
	// Utils
	// --------------------------------------

	public function mouseCoordsToCamera() {
		final mousePos = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
		final mouseToCameraPos = new Point(mousePos.x, mousePos.y);
		scene.camera.sceneToCamera(mouseToCameraPos);
		return mouseToCameraPos;
	}

	public abstract function jsEntityToEngineEntity(message:Dynamic):EngineBaseGameEntity;

	public abstract function jsEntitiesToEngineEntities(message:Dynamic):Array<EngineBaseGameEntity>;
}
