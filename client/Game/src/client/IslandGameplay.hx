package client;

import js.html.PopupBlockedEvent;
import h2d.col.Point;
import hxd.Window;
import hxd.Cursor;
import engine.IslandEngine;
import engine.entity.EngineCharacterEntity;
import client.entity.ClientCharacter;
import hxd.Key in K;

// TODO implement basic client gameplay class
class IslandGameplay {
	private final islandsManager:IslandsManager;

	private final islandEngine:IslandEngine;
	private final clientCharacters = new Map<String, ClientCharacter>();

	public var playerId:String;
	public var playerCharacterId:String;

	private final scene:h2d.Scene;

	//

	public function new(scene:h2d.Scene, leaveCallback:Void->Void) {
		this.scene = scene;

		islandsManager = new IslandsManager(scene);
		islandEngine = new IslandEngine();

		final c = new EngineCharacterEntity(100, 100);
		islandEngine.addCharacter(c);

		playerCharacterId = c.id;

		final clientChar = new ClientCharacter(scene, c);

		clientCharacters.set(clientChar.getId(), clientChar);

		// colliders
		// addCollider(scene, 100, 200, 200, 2);
		// addCollider(scene, 100, 200, 2, 80);
		// addCollider(scene, 100, 280, 260, 2);
		// addCollider(scene, 360, 280, 2, 300);
		// addCollider(scene, 100, 200, 2, 80);

		// Mouse debug
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
	}

	private var previousClick:Point;
	private var clicks = 0;

	function addColliderObject() {
		if (clicks == 2) {
			clicks = 0;

			final g = new h2d.Graphics(scene);

			g.lineStyle(3, 0xff0000);

			g.lineTo(previousClick.x, previousClick.y);

			final to = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			scene.camera.screenToCamera(to);

			g.lineTo(to.x, to.y);
		} else {
			previousClick = new Point(Window.getInstance().mouseX, Window.getInstance().mouseY);
			scene.camera.screenToCamera(previousClick);
		}
		trace(previousClick);
	}

	private function updateInput() {
		if (K.isPressed(K.MOUSE_LEFT)) {
			addColliderObject();
			clicks++;
		}

		final left = K.isDown(K.LEFT);
		final right = K.isDown(K.RIGHT);
		final up = K.isDown(K.UP);
		final down = K.isDown(K.DOWN);

		if (left)
			clientCharacters.get(playerCharacterId).moveLeft();
		if (right)
			clientCharacters.get(playerCharacterId).moveRight();
		if (up)
			clientCharacters.get(playerCharacterId).moveUp();
		if (down)
			clientCharacters.get(playerCharacterId).moveDown();
	}

	private function addCollider(scene:h2d.Scene, x:Int, y:Int, w:Int, h:Int) {
		islandEngine.addCollider(x, y, w, h);

		final fillRect = new h2d.Graphics(scene);
		fillRect.beginFill(0xff0000);
		fillRect.drawRect(x, y, w, h);
		fillRect.endFill();
	}
}
