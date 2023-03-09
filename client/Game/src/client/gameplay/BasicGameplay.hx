package client.gameplay;

import game.engine.navy.NavyTypesAndClasses.NavyInputCommand;
import hxd.Key in K;
import hxd.Window;
import h2d.col.Point;
import utils.Utils;
import client.entity.ClientShip;
// import client.entity.ClientCharacter;
import client.entity.ClientBaseGameEntity;
import client.network.Socket;
import client.network.SocketProtocol;
import game.engine.base.BaseTypesAndClasses;
import game.engine.base.entity.EngineBaseGameEntity;
import game.engine.base.core.BaseEngine;
import game.engine.navy.NavyGameEngine;
import game.engine.navy.entity.NavyShipEntity;

// import game.engine.IslandEngine;
// import game.engine.entity.EngineCharacterEntity;

enum GameState {
	Init;
	Playing;
	Died;
	Dock;
	Land;
}

abstract class BasicGameplay {
	public final baseEngine:BaseEngine;

	private final debugGraphics:h2d.Graphics;
	private final GameEntityLayer = 1;
	private final DebugLayer = 2;

	public var gameState = GameState.Init;

	// TODO replace by static ?
	public var playerId:String;
	public var playerEntityId:String;

	public var maxDragX = 300;
	public var maxDragY = 300;

	final clientMainEntities = new Map<String, ClientBaseGameEntity>();
	var clientMainEntitiesCount = 0;

	public final scene:h2d.Scene;

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
				scene.camera.x = playerEntity.x - (currentDrag.x * 0.5);
				scene.camera.y = playerEntity.y - (currentDrag.y * 0.5);
			}
		}
	}

	public function debugDraw() {
		if (GameConfig.DebugDraw) {
			for (entity in clientMainEntities) {
				entity.debugDraw(debugGraphics);
			}
		}
		debugGraphics.clear();
	}

	public function clearGraphics() {
		debugGraphics.clear();
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

		final movementAllowance = baseEngine.checkLocalMovementInputAllowance(playerEntityId, playerInputType);

		if (playerInputType != null && (up || down || left || right) && movementAllowance) {
			baseEngine.addInputCommand(new NavyInputCommand(playerInputType, playerId, Player.instance.incrementAndGetInputIndex()));

			Socket.instance.input({
				index: Player.instance.getInputIndex(),
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

	public function entityInputs(messages:SocketServerMessageEntityInputs) {
		if (gameState == GameState.Playing) {
			for (message in messages.inputs) {
				if (playerId != message.playerId) {
					baseEngine.addInputCommand(new NavyInputCommand(message.inputType, message.playerId, 0, message.shootDetails));
				}
			}
		}
	}

	public function entityInput(message:SocketServerMessageEntityInput) {
		if (gameState == GameState.Playing && playerId != message.playerId) {
			baseEngine.addInputCommand(new NavyInputCommand(message.inputType, message.playerId, 0, message.shootDetails));
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

			if (message.forced != null && message.entities.length != clientMainEntitiesCount) {
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
			final gameEngine = cast(baseEngine, NavyGameEngine);
			final shipEntity = cast(entity, NavyShipEntity);
			if (shipEntity.getOwnerId() == playerId) {
				playerEntityId = shipEntity.getId();
			}
			gameEngine.createMainEntity(shipEntity, true);
			newClientEntity = new ClientShip(shipEntity);
		} else if (baseEngine.engineGameMode == EngineGameMode.Island) {
			// final islandEngine = cast(baseEngine, IslandEngine);
			// final islandEntity = cast(entity, EngineCharacterEntity);
			// islandEngine.createMainEntity(islandEntity, true);

			// var characterName = Utils.MaskEthAddress(entity.getOwnerId());
			// if (islandEntity.getOwnerId() == playerId) {
			// 	playerEntityId = islandEntity.getId();
			// 	characterName = 'You';
			// }

			// newClientEntity = new ClientCharacter(characterName, islandEntity);
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
