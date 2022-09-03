package client;

import client.entity.ClientCharacter;
import client.network.Socket;
import client.network.SocketProtocol;
import engine.IslandEngine;
import engine.entity.EngineCharacterEntity;
import h2d.col.Point;
import hxd.Window;
import hxd.Key in K;

enum IslandGameState {
	Init;
	Dock;
	Land;
}

class Contour {
	private final from:Point;
	private final to:Point;

	public function new(from:Point, to:Point) {
		this.from = from;
		this.to = to;
	}

	public function print() {
		trace(from.x, from.y, to.x, to.y);
	}
}

class IslandGameplay {
	private final islandsManager:IslandsManager;

	private final islandEngine:IslandEngine;
	private final clientCharacters = new Map<String, ClientCharacter>();
	private var clientCharactersCount = 0;

	public var gameState = IslandGameState.Init;

	public var playerId:String;
	public var playerCharacterId:String;

	private final scene:h2d.Scene;

	//

	public function new(scene:h2d.Scene, leaveCallback:Void->Void) {
		this.scene = scene;

		islandsManager = new IslandsManager(scene);
		islandEngine = new IslandEngine();

		for (lineCollider in islandEngine.lineColliders) {
			addLineCollider(scene, lineCollider.x1, lineCollider.y1, lineCollider.x2, lineCollider.y2);
		}
	}

	public function update(dt:Float) {
		updateInput();

		for (character in clientCharacters) {
			character.update(dt);

			if (character.debugRect == null) {
				character.debugRect = new h2d.Graphics(scene);
			}
			if (character.debugRect != null) {
				character.debugRect.clear();
			}

			final graphics = character.debugRect;
			final rect = character.getEngineEntityRect();

			graphics.lineStyle(3, character.shapeColor);

			// Top line
			graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
			graphics.lineTo(rect.getTopRightPoint().x, rect.getTopRightPoint().y);

			// Right line
			graphics.lineTo(rect.getBottomRightPoint().x, rect.getBottomRightPoint().y);

			// Bottom line
			graphics.lineTo(rect.getBottomLeftPoint().x, rect.getBottomLeftPoint().y);

			// Left line
			graphics.lineTo(rect.getTopLeftPoint().x, rect.getTopLeftPoint().y);
		}

		final playerCharacter = getPlayerCharacter();
		if (playerCharacter != null) {
			scene.camera.x = hxd.Math.lerp(scene.camera.x, playerCharacter.x, 0.1);
			scene.camera.y = hxd.Math.lerp(scene.camera.y, playerCharacter.y, 0.1);
		}
	}

	private function getPlayerCharacter() {
		return clientCharacters.get(playerCharacterId);
	}

	private function updateInput() {
		final left = K.isDown(K.LEFT);
		final right = K.isDown(K.RIGHT);
		final up = K.isDown(K.UP);
		final down = K.isDown(K.DOWN);

		var movementChanged = false;
		if (left)
			movementChanged = islandEngine.characterMoveLeft(playerCharacterId);
		if (right)
			movementChanged = islandEngine.characterMoveRight(playerCharacterId);
		if (up)
			movementChanged = islandEngine.characterMoveUp(playerCharacterId);
		if (down)
			movementChanged = islandEngine.characterMoveDown(playerCharacterId);

		if (movementChanged && (up || down || left || right)) {
			Socket.instance.move({
				playerId: playerId,
				up: up,
				down: down,
				left: left,
				right: right
			});
		}

		// if (space) {
		// 	for (value in contour) {
		// 		value.print();
		// 	}
		// }

		final space = K.isPressed(K.SPACE);

		// if (K.isPressed(K.MOUSE_LEFT)) {
		// 	addColliderObject();
		// 	clicks++;
		// }
	}

	// Online stuff

	public function startGame(playerId:String, message:SocketServerMessageGameInit) {
		final characters = jsCharsToHaxeGameEngineChars(message.characters);

		for (character in characters) {
			islandEngine.addCharacter(character);

			final newClientChar = new ClientCharacter(scene, character);
			clientCharacters.set(character.id, newClientChar);
			clientCharactersCount++;

			if (character.ownerId == playerId) {
				playerCharacterId = character.id;
			}
		}
		this.playerId = playerId;
	}

	public function addEntity(message:SocketServerMessageAddEntity) {
		final character = jsCharToHaxeGameEngineChar(message.character);

		if (!clientCharacters.exists(character.id)) {
			islandEngine.addCharacter(character);
			final newClientShip = new ClientCharacter(scene, character);
			clientCharacters.set(character.id, newClientShip);
			clientCharactersCount++;
		}
	}

	public function entityMove(message:SocketServerMessageEntityMove) {
		if (playerCharacterId != message.entityId) {
			if (message.up)
				islandEngine.characterMoveUp(message.entityId);
			if (message.down)
				islandEngine.characterMoveDown(message.entityId);
			if (message.left)
				islandEngine.characterMoveLeft(message.entityId);
			if (message.right)
				islandEngine.characterMoveRight(message.entityId);
		}
	}

	public function removeEntity(message:SocketServerMessageRemoveEntity) {
		// TODO add server game engine check
		islandEngine.removeCharacter(message.entityId);
	}

	public function updateWorldState(message:SocketServerMessageUpdateWorldState) {
		for (character in message.characters) {
			final clientCharacter = clientCharacters.get(character.id);
			if (clientCharacter != null) {
				final distanceBetweenServerAndClient = hxd.Math.distance(character.x - clientCharacter.x, character.y - clientCharacter.y);
				if (distanceBetweenServerAndClient >= 50) {
					clientCharacter.updateEntityPosition(character.x, character.y);
				}
			}
		}
		if (message.characters.length != clientCharactersCount) {
			Socket.instance.sync({
				playerId: playerId
			});
		}
	}

	public function sync(message:SocketServerMessageSync) {
		for (character in message.characters) {
			final clientShip = clientCharacters.get(character.id);
			if (clientShip != null) {
				clientShip.updateEntityPosition(character.x, character.y);
			} else {
				final newCharacter = jsCharToHaxeGameEngineChar(character);
				islandEngine.addCharacter(newCharacter);
				final newClientShip = new ClientCharacter(scene, newCharacter);
				clientCharacters.set(newCharacter.id, newClientShip);
				clientCharactersCount++;
			}
		}
	}

	// --------------------------------------
	// Utils
	// --------------------------------------

	private function jsCharToHaxeGameEngineChar(character:EntityCharacter) {
		return new EngineCharacterEntity(character.x, character.y, character.id, character.ownerId);
	}

	private function jsCharsToHaxeGameEngineChars(characters:Array<EntityCharacter>) {
		return characters.map(character -> {
			return new EngineCharacterEntity(character.x, character.y, character.id, character.ownerId);
		});
	}

	// --------------------------------------
	// Collider debug stuff
	// --------------------------------------

	function addColliderObject() {
		if (firstColliderAdded) {
			final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			scene.camera.screenToCamera(to);

			final g = new h2d.Graphics(scene);
			g.lineStyle(3, 0xff0000);
			g.lineTo(previousClick.x, previousClick.y);
			g.lineTo(to.x, to.y);

			contour.push(new Contour(previousClick, to));

			previousClick = to;
		} else {
			if (clicks == 2) {
				clicks = 0;

				final g = new h2d.Graphics(scene);
				g.lineStyle(3, 0xff0000);
				g.lineTo(previousClick.x, previousClick.y);

				final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
				scene.camera.screenToCamera(to);

				g.lineTo(to.x, to.y);

				contour.push(new Contour(previousClick, to));

				firstColliderAdded = true;

				previousClick = to;
			} else {
				previousClick = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
				scene.camera.screenToCamera(previousClick);
			}
		}
	}

	private var previousClick:Point;
	private var clicks = 0;
	private var firstColliderAdded = false;
	private var contour = new Array<Contour>();

	private function addLineCollider(scene:h2d.Scene, x1:Float, y1:Float, x2:Float, y2:Float) {
		final g = new h2d.Graphics(scene);
		g.lineStyle(3, 0xff0000);
		g.lineTo(x1, y1);
		g.lineTo(x2, y2);
	}
}
